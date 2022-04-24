import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import S3ObjectChange from '../../../helper/file/S3ObjectChange';
import { AbstractBaseThesisServiceImpl } from '../abstract/AbstractBaseThesisServiceImpl';
import { ThesisRepository } from '../../repository/ThesisRepository';
import { ThesisRepositoryImpl } from '../../repository/impl/ThesisRepositoryImpl';
import { ThesisService } from '../ThesisService';
import { ThesisAttachment } from '../../../entity/ThesisAttachment';
import { Thesis } from '../../../entity/Thesis';

export class ThesisServiceImpl extends AbstractBaseThesisServiceImpl implements ThesisService {

  protected readonly repository: ThesisRepository = new ThesisRepositoryImpl();

  public async entryDownload(thesisId: number, userId: number): Promise<Thesis | null> { return this.repository.entryDownload(thesisId); }

  public async findAllSubmission(eqp: EntityQueryConfig, userId?: number): Promise<Thesis[]> { return this.repository.findAllSubmission(eqp); }

  public async updateStatus(slug: string, status: string): Promise<boolean> { return this.repository.updateStatus(slug, status); }

  public async updateThesisObject(id: string, slug: string, entityName: string, entry: ThesisAttachment | null, bucketName: string): Promise<ThesisAttachment | null> {
    let objectLocation: string = (<ThesisAttachment>entry).getLocation();
    let existsThesisObject: ThesisAttachment | null = await this.existsThesisObject(id, entityName);
    entry = await this.saveThesisObject(entityName, <ThesisAttachment>entry);

    if (entry !== null) {
      if (existsThesisObject !== null) { S3ObjectChange.objectDeleteByLocation(existsThesisObject.getLocation(), bucketName); }
      return entry;
    }
    else { S3ObjectChange.objectDeleteByLocation(objectLocation, bucketName); }
    return null;
  }

  public async remove(id: string): Promise<Thesis | null> {
    let thesis: Thesis | null = await this.entryExists(id);
    let thesisId: string = "0";

    if (thesis !== null) thesisId = thesis.getId() + "";
    let image: ThesisAttachment | null = await this.existsThesisObject(thesisId, 'ThesisCoverImage');
    let document: ThesisAttachment | null = await this.existsThesisObject(thesisId, 'ThesisDocument');
    
    image !== null ? S3ObjectChange.objectDeleteByLocation(image.getLocation(), 'THESIS_COVER_IMAGE') : void 0;
    document !== null ? S3ObjectChange.objectDeleteByLocation(document.getLocation(), 'THESIS_DOC') : void 0;
   
    return this.repository.remove(id);
  }

}
