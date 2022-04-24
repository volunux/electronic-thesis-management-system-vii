import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { ThesisStatusRepository } from '../../repository/ThesisStatusRepository';
import { ThesisStatusRepositoryImpl } from '../../repository/impl/ThesisStatusRepositoryImpl';
import { ThesisStatus } from '../../../entity/ThesisStatus';

export class ThesisStatusServiceImpl extends AbstractBaseServiceImpl<ThesisStatus> {

  protected readonly repository : ThesisStatusRepository = new ThesisStatusRepositoryImpl();
}