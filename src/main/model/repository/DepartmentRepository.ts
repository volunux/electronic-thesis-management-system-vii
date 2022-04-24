import { CrudRepositoryX } from './generic/CrudRepositoryX';
import { Department } from '../../entity/Department';

export interface DepartmentRepository extends CrudRepositoryX<Department> {

  verifyDepartment(id: number): Promise<Department | null>;
  findDepartmentInFaculty(id: number): Promise<Department[]>;
}