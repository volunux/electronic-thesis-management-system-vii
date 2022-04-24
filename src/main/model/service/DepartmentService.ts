import { CrudServiceX } from './abstract/CrudServiceX';
import { Department } from '../../entity/Department';

export interface DepartmentService extends CrudServiceX<Department> {
  verifyDepartment(id : number) : Promise<Department | null>;
  findDepartmentInFaculty(id : number) : Promise<Department[]>;
}
