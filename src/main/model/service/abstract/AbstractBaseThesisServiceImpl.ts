import { Logger } from 'winston';
import ConfigurationProperties from '../../../config/ConfigurationProperties';
import QueryClient from '../../query/util/QueryClient';
import S3ObjectChange from '../../../helper/file/S3ObjectChange';
import SimpleLogger from '../../../util/other/Logger';
import { AbstractBaseServiceImpl } from './AbstractBaseServiceImpl';
import { BaseThesisService } from '../abstract/BaseThesisService';
import { ObjectSweepService } from '../ObjectSweepService';
import { ObjectSweepServiceImpl } from '../impl/ObjectSweepServiceImpl';
import { CrudRepository } from '../../repository/generic/Repository';
import { BaseThesisRepository } from '../../repository/generic/BaseThesisRepository';
import { ThesisAttachment } from '../../../entity/ThesisAttachment';
import { Thesis } from '../../../entity/Thesis';
import { ObjectSweep } from '../../../entity/ObjectSweep';

export abstract class AbstractBaseThesisServiceImpl extends AbstractBaseServiceImpl<Thesis> implements BaseThesisService {

  protected abstract repository: BaseThesisRepository;
  private readonly objectSweepService: ObjectSweepService = new ObjectSweepServiceImpl();
  private readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': this.constructor.name })

  public async entryDownload(id: number, userId?: number): Promise<Thesis | null> { return null; }

  public async getEntryId(id: number): Promise<number> { return 0; }

  public async entryExists(id: string, userId?: number): Promise<Thesis | null> { return this.repository.entryExists(id, userId); }

  public async findOneById(id: number): Promise<Thesis | null> { return this.repository.findOneById(id); }

  public async update(id: string, entry: Thesis, userId?: number): Promise<Thesis | null> {
    entry.deleteTransientProps();
    return this.repository.update(id, entry, userId);
  }

  public async existsThesisObject(id: string, entityName: string): Promise<ThesisAttachment | null> { return this.repository.existsThesisObject(id, entityName); }

  public async saveThesisObject(entityName: string, entry: ThesisAttachment): Promise<ThesisAttachment | null> { return this.repository.saveThesisObject(entry, entityName); }

  public async updateThesisObject(id: string, slug: string, entityName: string, entry: ThesisAttachment | null, bucketName: string): Promise<ThesisAttachment | null> {
    let objectLocation: string = (<ThesisAttachment>entry).getLocation();
    let clt: QueryClient = await this.repository.getOrmClient();
    let ctx: AbstractBaseThesisServiceImpl = await this.transactionalService.get<AbstractBaseThesisServiceImpl>(this);
    let repos: CrudRepository<any>[] = [ctx.repository];
    let existsThesisObject: ThesisAttachment | null = null;
    let client: QueryClient = this.repository.getClient();
    (<ThesisAttachment>entry).setThesisId(id);

    try {
      await clt.beginTransaction([...repos], ctx);
      existsThesisObject = await ctx.existsThesisObject(id, entityName);
      entry = await ctx.saveThesisObject(entityName, <ThesisAttachment>entry);
      await ctx.setThesisStatusPending(slug);
      await clt.commit();
      if (entry !== null) {
        if (existsThesisObject !== null) { S3ObjectChange.objectDeleteByLocation(existsThesisObject.getLocation(), bucketName); }
        return entry;
      }
      else { S3ObjectChange.objectDeleteByLocation(objectLocation, bucketName); }
    }
    catch (err: any) {
      entry = null;
      this.logger.error(err);
      await clt.rollback();
    }
    finally { await clt.endTransaction(); }
    return entry;
  }

  public async deleteThesisObjectByKey(key: string, entityName: string, bucketName: string): Promise<ThesisAttachment | null> {
    let entry: ThesisAttachment | null = null;
    try {
      entry = await this.repository.deleteThesisObjectByKey(key, entityName);
      if (entry !== null) {
        await S3ObjectChange.objectDeleteByKey(key, bucketName);
        return entry;
      }
    }
    catch (err: any) {
      entry = null;
      this.logger.error(err);
    }
    return entry;
  }

  public async updateOneContent(id: string, userId?: number): Promise<Thesis | null> { return this.repository.updateOneContent(id, userId); }

  public async updateContent(id: string, entry: Thesis, userId?: number): Promise<Thesis | null> { return this.repository.updateContent(id, entry, userId); }

  public async setThesisStatusPending(id: string): Promise<boolean> { return this.repository.setThesisStatusPending(id); }

  public async deleteMany(entries: string): Promise<Thesis[]> {
    let clt: QueryClient = await this.repository.getOrmClient();
    let ctx: AbstractBaseThesisServiceImpl = await this.transactionalService.get<AbstractBaseThesisServiceImpl>(this);
    let repos: CrudRepository<any>[] = [ctx.repository, ctx.objectSweepService.getRepository()];
    let documents: ThesisAttachment[] = [];
    let documentObjects: ObjectSweep[] = [];
    let coverImages: ThesisAttachment[] = [];
    let coverImageObjects: ObjectSweep[] = [];
    let entriesDeleted: Thesis[] | null = [];

    try {
      await clt.beginTransaction([...repos], ctx);
      documents = await ctx.repository.findManyObject(entries, 'ThesisDocument');
      documentObjects = documents.map((entry: ThesisAttachment): ObjectSweep => {
        let newEntry: ObjectSweep = new ObjectSweep(entry);
        let bucketName: string = ctx.eProps.getThesisDocBucket();
        newEntry.setBucketName(bucketName);
        return newEntry;
      });
      await ctx.objectSweepService.saveMany(documentObjects);
      coverImages = await ctx.repository.findManyObject(entries, 'ThesisCoverImage');
      coverImageObjects = coverImages.map((entry: ThesisAttachment): ObjectSweep => {
        let newEntry: ObjectSweep = new ObjectSweep(entry);
        let bucketName: string = ctx.eProps.getThesisCoverImageBucket();
        newEntry.setBucketName(bucketName);
        return newEntry;
      });

      await ctx.objectSweepService.saveMany(coverImageObjects);
      entriesDeleted = await ctx.repository.deleteMany(entries);
      await clt.commit();
    }
    catch (err: any) {
      entriesDeleted = [];
      await clt.rollback();
    }
    finally { await clt.endTransaction(); }
    return entriesDeleted;
  }

}
