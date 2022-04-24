import { PoolClient, QueryResult } from 'pg';
import DataSource from './DataSource';
import Query from './Query';
import QueryClient from './QueryClient';
import { CrudRepository } from '../../repository/generic/Repository';

export class QueryClientImpl implements QueryClient {

  private client: PoolClient | null;
  private transactionEnabled: boolean = false;
  private repositories: CrudRepository<any>[] = [];
  private originalDataSources: DataSource[] = [];

  constructor(client?: PoolClient) {
    this.client = client ? client : null;
  }

  /**
 * 
 * @param {Object[]} facade  - The facade to this method must be typed and implements the CrudRepository interface that allows methods to obtain a transaction manager.
 * Each repository contained in the array would be created as a new and an isolated copy of the original.
 * @param {Object} context - This is typically a service facade that handles business logic of the application and in this contexts of transaction, create a new connection
 * and binds each CrudRepository facade to its context in order to perform the transaction.
 * @returns {void} returns nothing
 */
  async beginTransaction(facade: CrudRepository<any>[]): Promise<void> {
    if (this.client !== null && this.transactionEnabled === false) {
      await this.client.query('BEGIN');
      this.transactionEnabled = !this.transactionEnabled;
    }
    else if (this.client === null && this.transactionEnabled === false) {
      this.client = await DataSource.getClient();
      this.client.query('BEGIN');
      this.transactionEnabled = !this.transactionEnabled;
    }

    for (let idx in facade) {
      if (!this.repositories.includes(facade[idx])) {
        this.repositories.push(facade[idx]);
        this.originalDataSources.push(facade[idx].getQueryTemplate().getDataSource().getOriginalDataSource());
        facade[idx].setClient(this);
      }
    }

    for (let repo of this.repositories) { repo.getQueryTemplate().bindSource(this); }
  }

  async execute(text: string, params: string[]): Promise<QueryResult> {
    if (this.client !== null && this.transactionEnabled === true) {
      return this.client.query(text, params);
    }
    else {
      this.client = await DataSource.getClient();
      return this.client.query(text, params);
    }
  }

  async commit(facade?: CrudRepository<any>): Promise<void> { this.setMessage('COMMIT', facade); }

  async rollback(facade?: CrudRepository<any>): Promise<void> { this.setMessage('ROLLBACK', facade); }

  /**
 * 
 * @param {string} message - This argument is used to set the isolation property of the transaction and transaction propagation
 * @param {Object} facade - An object that implements the CrudRepository interface and whose transaction propagration and isolation property can be set.
 * @returns {void} This function or setter returns nothing.
 */
  private async setMessage(message: string, facade?: CrudRepository<any>): Promise<void> {

    if (this.client !== null && this.transactionEnabled === true) {
      for (let dsIdx in this.originalDataSources) {
        if (this.repositories[dsIdx] === facade) {
          facade.getQueryTemplate().bindSource(this.originalDataSources[dsIdx]);
          this.originalDataSources.splice(+dsIdx, 1);
          this.repositories.splice(+dsIdx, 1);
          if (facade !== null) facade.setClient(null);
          if (this.originalDataSources.length === 0) {
            if (this.client !== null) await this.client.query(message);
          }
        }
      }
    }
  }


  /**
   * When this method is called, it sets the isolated context and its repository objects to a null value including the transaction manager. As a result, it is highly unlikely there will be further reference to them
   * and therefore they would be available for garbage collection 
   */
  async endTransaction(): Promise<void> {
    if (this.client !== null && this.originalDataSources.length === 0) {
      this.client.release();
      this.transactionEnabled = false;
      this.originalDataSources = [];
      this.repositories = [];
      this.client = null;
    }
  }

  getOriginalDataSource(): Query { return this; }
}