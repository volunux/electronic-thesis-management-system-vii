import { CrudServiceX } from './CrudServiceX';
import { ThesisAttachment } from '../../../entity/ThesisAttachment';
import { Thesis } from '../../../entity/Thesis';

export interface BaseThesisService extends CrudServiceX<Thesis> {

  getEntryId(id: number): Promise<number>;
  findOneById(id: number): Promise<Thesis | null>;
  entryExists(id: string, userId?: number): Promise<Thesis | null>;
  existsThesisObject(id: string, entityName: string): Promise<ThesisAttachment | null>;
  saveThesisObject(entityName: string, entry: ThesisAttachment): Promise<ThesisAttachment | null>;
  updateThesisObject(id: string, slug: string, entityName: string, entry: ThesisAttachment | null, bucketName: string): Promise<ThesisAttachment | null>;
  updateOneContent(id: string, userId?: number): Promise<Thesis | null>;
  updateContent(id: string, entry: Thesis, userId?: number): Promise<Thesis | null>;
  deleteThesisObjectByKey(key: string, entityName: string, bucketName: string): Promise<ThesisAttachment | null>;
  setThesisStatusPending(id: string): Promise<boolean>;
  entryDownload(id: number, userId?: number): Promise<Thesis | null>;
}
