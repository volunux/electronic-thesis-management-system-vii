import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { FacultyRepository } from '../../repository/FacultyRepository';
import { FacultyRepositoryImpl } from '../../repository/impl/FacultyRepositoryImpl';
import { Faculty } from '../../../entity/Faculty';

export class FacultyServiceImpl extends AbstractBaseServiceImpl<Faculty> {

  protected readonly repository : FacultyRepository = new FacultyRepositoryImpl();
}
