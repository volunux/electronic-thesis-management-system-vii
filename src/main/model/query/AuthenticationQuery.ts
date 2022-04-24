import { AbstractBaseQueryImpl } from './impl/AbstractBaseQueryImpl';
import { DynamicQuery } from './util/DynamicQuery';
import { User } from '../../entity/User';

export class AuthenticationQuery extends AbstractBaseQueryImpl<User> {

  public save(user: User): DynamicQuery {
    let text: string = `INSERT INTO USERS (first_name , last_name , email_address , username , country_id , salt , hash , matriculation_number , status_id , department_id , faculty_id , level_id)
                          VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 ,
                          (SELECT _id FROM USER_STATUS AS vx WHERE vx.name = 'Active' LIMIT 1) , (SELECT _id FROM DEPARTMENT AS vx WHERE vx.name = 'Other' LIMIT 1) ,
                          (SELECT _id FROM FACULTY AS vx WHERE vx.name = 'Other' LIMIT 1) , (SELECT _id FROM LEVEL AS vx where vx.name = 'Other' LIMIT 1) )
                          RETURNING _id , first_name , last_name , email_address , username , hash , salt , department_id AS department , faculty_id AS faculty , level_id AS level
                        `;

    let values: any[] = [user.getFirstName(), user.getLastName(), user.getEmailAddress(), user.getUsername(), user.getCountry(), user.getSalt(), user.getHash(), user.getMatriculationNumber()];

    return DynamicQuery.create(text, values);
  }

  public saveRole(user: User): DynamicQuery {
    let text: string = `INSERT INTO USER_ROLE (user_id , role_id) VALUES ($1 , (SELECT _id FROM ROLE AS rl WHERE rl.word = 'Student' LIMIT 1) ) RETURNING user_id AS _id`;
    let values: any[] = [user.getId()];

    return DynamicQuery.create(text, values);
  }

}