import { CrudRepositoryX } from './CrudRepositoryX';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Thesis } from '../../../entity/Thesis';
import { ThesisAttachment } from '../../../entity/ThesisAttachment';

export interface BaseThesisRepository extends CrudRepositoryX<Thesis> {

  findAllSubmission(eqp: EntityQueryConfig, userId?: number): Promise<Thesis[]>;
  getEntryId(id: number): Promise<number>;
  findOneById(id: number): Promise<Thesis | null>;
  entryExists(slug: string, userId?: number): Promise<Thesis | null>;
  existsThesisObject(id: string | number, entityName: string): Promise<ThesisAttachment | null>;
  saveThesisObject(entry: ThesisAttachment, entityName: string): Promise<ThesisAttachment | null>;
  updateThesisObject(slug: string, entityName: string): Promise<ThesisAttachment | null>;
  updateOneContent(id: string | number, userId?: number): Promise<Thesis | null>;
  updateContent(id: string | number, entry: Thesis, userId?: number): Promise<Thesis | null>;
  deleteThesisObjectByKey(key: string, entityName: string): Promise<ThesisAttachment | null>;
  setThesisStatusPending(id: string | number): Promise<boolean>;
  findManyObject(entries: string, entityName: string): Promise<ThesisAttachment[]>;
  entryDownload(id: number, userId?: number): Promise<Thesis | null>;
} 