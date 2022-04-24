import "reflect-metadata";
import { join } from 'path';
import { createConnection, Connection } from "typeorm";
import { Logger } from 'winston';
import SimpleLogger from '../../util/other/Logger';
import ConfigurationProperties from '../ConfigurationProperties';


export default class OrmDBConnection {

  private static readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private static readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': OrmDBConnection.name });

  static initializeConnection(): void {
    createConnection({
      "type": "postgres",
      "host": this.eProps.getDatabaseHost(),
      "port": this.eProps.getDatabasePort(),
      "username": this.eProps.getDatabaseUsername(),
      "password": this.eProps.getDatabasePassword(),
      "database": this.eProps.getDatabaseName(),
      "synchronize": true,
      "logging": false,
      'ssl': {
        'rejectUnauthorized': false
      },
      // "logging": ['query' , 'error' , 'schema' , 'warn' , 'info'],
      "entities": [join(__dirname, '../../entity/*.{ts,js}')],
      'entitySkipConstructor': true,
      'dropSchema': false,
      'cache': false,
      'entityPrefix': undefined,
      "migrations": [
        "src/migration/**/*.ts"
      ],
      "subscribers": [
        "src/subscriber/**/*.ts"
      ],
      "extra": {
        "connectionLimit": this.eProps.getMaxNumberOfClientOrm()
      }
    })
      .then((connection: Connection) => { this.logger.info(`Connection successful`); })
      .catch((err: any) => { this.logger.error(err); });
  }
} 
