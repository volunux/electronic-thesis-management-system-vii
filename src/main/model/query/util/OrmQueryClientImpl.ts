import QueryClient from './QueryClient';
import Query from './Query';
import { CrudRepository } from '../../repository/generic/Repository';
import { EntityManager, getConnection, QueryRunner } from 'typeorm';
import { TransactionalService } from './TransactionalService';
import { TransactionalServiceImpl } from './TransactionalServiceImpl';

export class OrmQueryClientImpl implements QueryClient {

  /**
   * The property thats holds a single connection used to perform a single unit of transaction.
   */
  private transactionManager: EntityManager | null;
  private queryRunner: QueryRunner | null;
  private facades: CrudRepository<any>[] = [];
  private transactionalService: TransactionalService = new TransactionalServiceImpl();
  private context?: any;

  /**
   * 
   * @param {Object[]} facade  - The facade to this method must be typed and implements the CrudRepository interface that allows methods to obtain a transaction manager.
   * Each repository contained in the array would be created as a new and an isolated copy of the original.
   * @param {Object} context - This is typically a service facade that handles business logic of the application and in this contexts of transaction, create a new connection
   * and binds each CrudRepository facade to its context in order to perform the transaction.
   * @returns {void} returns nothing
   */
  public async beginTransaction(facade: CrudRepository<any>[], context?: any): Promise<void> {
    this.queryRunner = getConnection().createQueryRunner();
    this.transactionManager = this.queryRunner.manager;
    if (!(context && facade && typeof facade === 'object' && facade.hasOwnProperty('length'))) return;
    this.context = context;
    for (let prop in context) {
      for (let idx in facade) {
        if (context[prop] === facade[idx]) {
          context[prop] = await this.transactionalService.get(facade[idx]);
          if (context[prop] && context[prop].setTransactionManager) await context[prop].setTransactionManager(this.transactionManager);
          this.facades.push(context[prop]);
        }
      }
    }

    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  public async commit(facade?: CrudRepository<any>): Promise<void> { if (this.queryRunner !== null) await this.queryRunner.commitTransaction(); }

  public async execute(text: string, params: string[]): Promise<void> { }

  public async rollback(facade?: CrudRepository<any>): Promise<void> { if (this.queryRunner !== null) await this.queryRunner.rollbackTransaction(); }

  /**
   * 
   * @param {string} message - This argument is used to set the isolation property of the transaction and transaction propagation
   * @param {Object} facade - An object that implements the CrudRepository interface and whose transaction propagration and isolation property can be set.
   * @returns {void} This function or setter returns nothing.
   */
  private async setMessage(message: string, facade?: CrudRepository<any>): Promise<void> { }

  /**
   * When this method is called, it sets the isolated context and its repository objects to a null value including the transaction manager. As a result, it is highly unlikely there will be further reference to them
   * and therefore they would be available for garbage collection 
   */
  async endTransaction(): Promise<void> {

    if (this.queryRunner !== null) await this.queryRunner.release();
    this.transactionManager = null;
    this.queryRunner = null;
    for (let idx in this.facades) {
      this.facades[idx].setTransactionManager(null);
      (<any>this.facades)[idx] = null;
    }
    this.context = null;
  }

  getOriginalDataSource(): Query { return null as any; }

}