import DataSource from '../../query/util/DataSource';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { QueryTemplate } from '../../query/util/QueryTemplate';
import { SimpleQueryTemplate } from '../../query/util/SimpleQueryTemplate';
import { AbstractBaseRepositoryImpl } from './AbstractBaseRepositoryImpl';
import { AbstractBaseThesisQuery } from '../../query/interface/AbstractBaseThesisQuery';
import { Newable } from '../../../entity/interface/Newable';
import { DynamicQuery } from '../../query/util/DynamicQuery';
import { Thesis } from '../../../entity/Thesis';
import { ThesisAttachment } from '../../../entity/ThesisAttachment';
import { BaseThesisRepository } from '../generic/BaseThesisRepository';

export abstract class AbstractBaseThesisRepositoryImpl extends AbstractBaseRepositoryImpl<Thesis> implements BaseThesisRepository {

  protected queryTemplate: QueryTemplate<Thesis> = new SimpleQueryTemplate<Thesis>(new DataSource());
  protected VxEntity: Newable<Thesis> = Thesis;
  protected abstract query: AbstractBaseThesisQuery<Thesis>;
  protected queryTemplateObject: QueryTemplate<ThesisAttachment> = new SimpleQueryTemplate<ThesisAttachment>(new DataSource());

  public async entryExists(id: string, userId?: number): Promise<Thesis | null> { return null; }

  public async findOneById(id: number): Promise<Thesis | null> { return null; }

  public async existsThesisObject(id: string | number): Promise<ThesisAttachment | null> { return null; }

  public async saveThesisObject(entry: ThesisAttachment, entityName: string): Promise<ThesisAttachment | null> { return null; }

  public async updateThesisObject(slug: string, entityName: string): Promise<ThesisAttachment | null> { return null; }

  public async deleteThesisObjectByKey(key: string, entityName: string): Promise<ThesisAttachment | null> { return null; }

  public async updateOneContent(id: string, userId?: number): Promise<Thesis | null> { return null; }

  public async updateContent(id: string, entry: Thesis, userId?: number): Promise<Thesis | null> { return null; }

  public async setThesisStatusPending(id: string): Promise<boolean> {
    let plan: DynamicQuery = this.query.setThesisStatusPending(id);

    return await this.queryTemplate.updateOrThrow(plan.getText(), plan.getValues());
  }

  public async findManyObject(entries: string, entityName: string): Promise<ThesisAttachment[]> { return []; }

  public async findAllSubmission(q: EntityQueryConfig, userId?: number): Promise<Thesis[]> { return []; }

  public async getEntryId(id: number): Promise<number> { return 0; }

  public async entryDownload(id: number, userId?: number): Promise<Thesis | null> { return null; }

}