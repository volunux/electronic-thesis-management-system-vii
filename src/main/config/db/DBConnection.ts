import { Client, Pool, PoolClient, types } from 'pg';
import { Logger } from 'winston';
import SimpleLogger from '../../util/other/Logger';
import ConfigurationProperties from '../../config/ConfigurationProperties';

export default class DBConnection {

  private static readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': DBConnection.name });
  private static readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();

  static connect(): void {
    const pool: Pool = DBConnection.getPool();

    pool.connect()
      .then((client: PoolClient) => { this.logger.info('Connected to DB'); })
      .catch((err: any) => { this.logger.error(err); });
  }

  static getPool(): Pool {
    const pool: Pool = new Pool({
      'user': this.eProps.getDatabaseUsername(),
      'host': this.eProps.getDatabaseHost(),
      'database': this.eProps.getDatabaseName(),
      'password': this.eProps.getDatabasePassword(),
      'port': this.eProps.getDatabasePort(),
      'max': this.eProps.getMaxNumberOfClient(),
      'idleTimeoutMillis': this.eProps.getIdleTimeoutMillis(),
      'ssl': {
        'rejectUnauthorized': false
      }
    });

    types.setTypeParser(types.builtins.TIME, (timeStr) => timeStr);
    types.setTypeParser(types.builtins.TIMESTAMP, (timeStr) => timeStr);
    types.setTypeParser(types.builtins.TIMESTAMPTZ, (timeStr) => timeStr);
    return pool;
  }
}