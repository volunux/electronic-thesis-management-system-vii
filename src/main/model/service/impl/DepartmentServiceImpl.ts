import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { DepartmentRepository } from '../../repository/DepartmentRepository';
import { DepartmentRepositoryImpl } from '../../repository/impl/DepartmentRepositoryImpl';
import { Department } from '../../../entity/Department';

export class DepartmentServiceImpl extends AbstractBaseServiceImpl<Department> {

  protected readonly repository: DepartmentRepository = new DepartmentRepositoryImpl();

  public async verifyDepartment(id: number): Promise<Department | null> { return this.repository.verifyDepartment(id); }

  public async findDepartmentInFaculty(id: number): Promise<Department[]> {
    return this.repository.findDepartmentInFaculty(id);
  }
}
