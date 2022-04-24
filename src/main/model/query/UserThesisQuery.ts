import { AbstractBaseThesisQueryImpl } from './impl/AbstractBaseThesisQueryImpl';
import { DynamicQuery } from './util/DynamicQuery';
import { ThesisDeleteRequest } from '../../entity/ThesisDeleteRequest';
import { Thesis } from '../../entity/Thesis';

export class UserThesisQuery extends AbstractBaseThesisQueryImpl {

  public save(entry: Thesis): DynamicQuery {
    let text: string = `INSERT INTO THESIS (title , price , content , number_of_page , grade_id , supervisor , publication_year , publisher_id , faculty_id , department_id , slug , user_id , author_name , 
    status_id) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 , (SELECT _id FROM THESIS_STATUS AS st WHERE st.name = 'Pending' LIMIT 1)) 
    RETURNING _id , title , price , number_of_page , supervisor , slug`;

    let values: any[] = [entry.getTitle(), entry.getPrice(), entry.getContent(), entry.getNumberOfPage(), entry.getGradeId(), entry.getSupervisor(),
    entry.getPublicationYear(), entry.getPublisherId(), entry.getFacultyId(), entry.getDepartmentId(), entry.getSlug(), entry.getUserId(), entry.getAuthorName()];
 
    return DynamicQuery.create(text, values);
  }

  public update(slug: string, entry: Thesis, user_id?: number): DynamicQuery {
    let text: string = `UPDATE THESIS AS th SET title = $1 , price = $2 , number_of_page = $3 , author_name = $4 , supervisor = $5 , publication_year = $6 , grade_id = $7 , department_id = $8 , faculty_id = $9 , 
            publisher_id = $10 , user_id = $11 , updated_on = $12 , status_id = st._id FROM THESIS_STATUS AS st WHERE th.slug = $13 AND th.user_id = $14 AND st.name = 'Pending'
            RETURNING th._id , th.title , th.publication_year , th.slug`;

    let values: any[] = [entry.getTitle(), entry.getPrice(), entry.getNumberOfPage(), entry.getAuthorName(), entry.getSupervisor(), entry.getPublicationYear(), entry.getGradeId(), entry.getDepartmentId(),
    entry.getFacultyId(), entry.getPublisherId(), entry.getUserId(), 'NOW()', slug, user_id];
  
    return DynamicQuery.create(text, values);
  }

  public updateContent(slug: string, entry: Thesis, user_id?: number): DynamicQuery {
    let text: string = `UPDATE THESIS AS th SET content = $1 , updated_on = $2 , status_id = st._id FROM THESIS_STATUS AS st WHERE th.slug = $3 AND th.user_id = $4 AND st.name = 'Pending'
            RETURNING th._id , th.title , th.publication_year , th.slug`;

    let values: any[] = [entry.getContent(), 'NOW()', slug, user_id];
 
    return DynamicQuery.create(text, values);
  }

  public saveDeleteRequest(id: number, entry: ThesisDeleteRequest): DynamicQuery {
    let text: string = `INSERT INTO THESIS_DELETE_REQUEST (message , thesis_id , requester_id , status_id) VALUES ($1 , $2 , $3 , (SELECT _id FROM THESIS_DELETE_REQUEST_STATUS AS st 
    WHERE st.name = 'Pending' LIMIT 1)) RETURNING _id`;

    let values: any[] = [entry.getMessage(), entry.getThesisId(), entry.getRequesterId()];
 
    return DynamicQuery.create(text, values);
  }

}