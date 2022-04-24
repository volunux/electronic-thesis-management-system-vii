import { VxEntityOneRepositoryImpl } from '../abstract/VxEntityOneRepositoryImpl';
import { AbbreviationEntitySearch } from '../../../helper/search/impl/AbbreviationEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { DepartmentRepository } from '../DepartmentRepository';
import { Department } from '../../../entity/Department';
import { VxRepository } from '../../../util/decorators/VxRepository';
import { getRepository } from 'typeorm';

@VxRepository()
export class DepartmentRepositoryImpl extends VxEntityOneRepositoryImpl<Department> implements DepartmentRepository {

  protected readonly search : AbbreviationEntitySearch<Department> = AbbreviationEntitySearch.getInstance({});
  protected readonly VxEntity : Newable<Department> = Department;

  public async findOne(id : string | number , userId? : number) : Promise<Department | null> {
    let entry : Department | undefined = await getRepository(Department).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.user` , `usr`).innerJoinAndSelect(`vx.faculty` , `ft`).where({'_id' : id})
    .select([`vx` , `usr._id` , `usr.first_name` , `usr.last_name` , `ft._id` , `ft.name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateOne(id : string | number , userId? : number) : Promise<Department | null> {
    let entry : Department | undefined = await getRepository(this.VxEntity).createQueryBuilder(`vx`).where({'_id' : id})
    .select([`vx._id` , `vx.name` , `vx.abbreviation` , `vx.description` , `vx.faculty_id`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async deleteOne(id : string | number , userId? : number) : Promise<Department | null> {
    let entry : Department | undefined = await getRepository(Department).createQueryBuilder(`vx`).where({'_id' : id}).leftJoinAndSelect(`vx.faculty` , `ft`)
    .select([`vx._id` , `vx.name` , `vx.abbreviation` , `vx.faculty_id` , `ft.name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  } 

  public async verifyDepartment(id : number) : Promise<Department | null> {
    let entry : Department | undefined = await getRepository(Department).createQueryBuilder(`vx`).where({'_id' : id}).select([`vx._id` , `vx.faculty_id`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findDepartmentInFaculty(id : number) : Promise<Department[]> {
    return await getRepository(Department).createQueryBuilder(`vx`).where({'faculty_id' : id}).select([`vx._id` , `vx.name`]).getMany(); }

}