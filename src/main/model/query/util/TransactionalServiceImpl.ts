import { CrudRepository } from '../../repository/generic/Repository';
import { TransactionalService } from './TransactionalService';

export class TransactionalServiceImpl implements TransactionalService  {

  /**
   * This method is formally used in the context of transaction management where the method that is going to perform the transaction will create a copy of its context service and its properties.
   * @param {Object} context - The object whose copy should be created and returned to the caller of the method.
   * @returns {Object} The new context which is a copy of the original context passed in the method argument.
   */
  async get<S>(context : S) : Promise<S> {
    let resContext : S = Object.assign(Object.create({}) , context as any);
    let contextProto : any = Object.getPrototypeOf(context);
    Object.setPrototypeOf(resContext , contextProto);

    return resContext as S;
  }
}