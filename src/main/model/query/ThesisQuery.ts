import { AbstractBaseThesisQueryImpl } from './impl/AbstractBaseThesisQueryImpl';
import { DynamicQuery } from './util/DynamicQuery';
import { Thesis } from '../../entity/Thesis';

export class ThesisQuery extends AbstractBaseThesisQueryImpl {

  public update(slug: string, entry: Thesis, user_id?: number): DynamicQuery {
    let text: string = `UPDATE THESIS AS vx SET title = $1 , price = $2 , number_of_page = $3 , author_name = $4 , supervisor = $5 , publication_year = $6 , grade_id = $7 , department_id = $8 , faculty_id = $9 , 
            publisher_id = $10 , user_id = $11 , status_id = $12 , updated_on = $13 WHERE vx.slug = $14 RETURNING vx._id , vx.title , vx.publication_year , vx.slug`;

    let values: any[] = [entry.getTitle(), entry.getPrice(), entry.getNumberOfPage(), entry.getAuthorName(), entry.getSupervisor(), entry.getPublicationYear(), entry.getGradeId(), entry.getDepartmentId(),
    entry.getFacultyId(), entry.getPublisherId(), entry.getUserId(), entry.getStatusId(), 'NOW()', slug];

    return DynamicQuery.create(text, values);
  }

}