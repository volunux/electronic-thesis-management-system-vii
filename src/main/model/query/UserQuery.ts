import { AbstractBaseQueryImpl } from './impl/AbstractBaseQueryImpl';
import { DynamicQuery } from './util/DynamicQuery';
import { User } from '../../entity/User';

export class UserQuery extends AbstractBaseQueryImpl<User> {

  public update(id: number, entry: User): DynamicQuery {
    let text: string = `UPDATE USERS SET first_name = $1 , last_name = $2 , about = $3 , matriculation_number = $4 , department_id = $5 , faculty_id = $6 , level_id = $7 , country_id = $8 , status_id = $9 , \
    updated_on = $10 WHERE _id = $11 RETURNING _id , first_name , last_name , email_address , username`;
    let values: any[] = [entry.getFirstName(), entry.getLastName(), entry.getAbout(), entry.getMatriculationNumber(), entry.getDepartmentId(), entry.getFacultyId(),
    entry.getLevelId(), entry.getCountryId(), entry.getStatusId(), 'NOW()', id];

    return DynamicQuery.create(text, values);
  }

  public updateStatus(id: number, status: string): DynamicQuery {
    let text: string = `UPDATE USERS AS vx SET status_id = $1 FROM USER_STATUS AS st WHERE vx._id = $2 AND st._id = $1 RETURNING vx._id`;
    let values: any[] = [status, id];

    return DynamicQuery.create(text, values);
  }

}