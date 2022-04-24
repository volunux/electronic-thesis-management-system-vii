import { CrudRepository } from '../../repository/generic/Repository';

export interface TransactionalService {

  get<S>(context : S) : Promise<S>;
}