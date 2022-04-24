import { AbstractBaseThesisQuery } from '../interface/AbstractBaseThesisQuery';
import { AbstractBaseQueryImpl } from './AbstractBaseQueryImpl';
import { DynamicQuery } from '../util/DynamicQuery';
import { Thesis } from '../../../entity/Thesis';

export abstract class AbstractBaseThesisQueryImpl extends AbstractBaseQueryImpl<Thesis> implements AbstractBaseThesisQuery<Thesis> {

  public save(entry : Thesis) : DynamicQuery {
    let text : string = `INSERT INTO THESIS (title , price , content , number_of_page , grade_id , supervisor , publisher_id , publication_year , faculty_id , department_id , slug , user_id , author_name , 
    status_id) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 , (SELECT _id FROM THESIS_STATUS AS st WHERE st.name = 'Pending' LIMIT 1)) RETURNING _id , title , price , 
    number_of_page , supervisor , slug`;

    let values : any[] = [entry.getTitle() , entry.getPrice() , entry.getContent() , entry.getNumberOfPage() , entry.getGradeId() , entry.getSupervisor() , entry.getPublisherId() , entry.getPublicationYear() , 
                          entry.getFacultyId() , entry.getDepartmentId() , entry.getSlug() , entry.getUserId() , entry.getAuthorName()];
    return DynamicQuery.create(text , values);
  }

  public setThesisStatusPending(slug : string) : DynamicQuery {
    let text : string = `UPDATE THESIS AS vx SET updated_on = $1 , status_id = st._id FROM THESIS_STATUS AS st WHERE vx.slug = $2 AND st.name = 'Pending'
                        RETURNING vx._id , vx.title , vx.publication_year , vx.slug`;
    let values : any[] = ['NOW()' , slug];
    return DynamicQuery.create(text , values);
  } 

  public updateStatus(slug : string , status : string) : DynamicQuery {
    let text : string = `UPDATE THESIS AS vx SET status_id = $1 , updated_on =$2 FROM THESIS_STATUS AS st WHERE vx.slug = $3 AND st._id = $1 RETURNING vx._id`;
    let values : any[] = [status , 'NOW()' , slug];
    return DynamicQuery.create(text , values);
  } 

}