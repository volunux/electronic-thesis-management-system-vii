import aws , { AWSError } from 'aws-sdk';
import cron from 'node-schedule';
import FileConfigurerImpl from '../../util/aws/s3/FileConfigurerImpl';
import SimpleLogger from '../../util/other/Logger';
import { Logger , Profiler } from 'winston';
import { JobRunner } from './JobRunner';
import { ObjectSweep } from '../../entity/ObjectSweep';
import { ObjectSweepRepository } from '../../model/repository/ObjectSweepRepository';
import { ObjectSweepRepositoryImpl } from '../../model/repository/impl/ObjectSweepRepositoryImpl';

aws.config.update(FileConfigurerImpl.getInstance().getConfiguration());

export class ObjectSweepJob implements JobRunner {

  private static instance : ObjectSweepJob;
  private repository : ObjectSweepRepository = new ObjectSweepRepositoryImpl();
  private readonly logger : Logger = SimpleLogger.getLogger().child({'component' : ObjectSweepJob.name});
  private s3 : aws.S3 = new aws.S3();

  private constructor() { }

  public static getInstance() : ObjectSweepJob { if (!ObjectSweepJob.instance) { ObjectSweepJob.instance = new ObjectSweepJob(); }
    return ObjectSweepJob.instance; }

  public async execute() : Promise<void> {
    let context : ObjectSweepJob = this;
    let s3Context : aws.S3 = this.s3;
    const profiler : Profiler = this.logger.startTimer();
    cron.scheduleJob('* */59 */23 * * *' , async function() {
     let entries : ObjectSweep[] = await context.repository.findAll(null);
     for (let entry of entries) {
        try {
          let params : aws.S3.HeadObjectRequest | aws.S3.DeleteObjectRequest = {'Bucket' : entry.getBucketName() , 'Key' : entry.getKey()};
          let details : aws.S3.HeadObjectOutput = await context.s3.headObject(params).promise();

          if (details) { let details2 : aws.S3.DeleteObjectOutput = await s3Context.deleteObject(params).promise(); 
          context.repository.remove(entry.getKey()); } }
        catch(err : any) { let awsErr : AWSError = err;
          if (awsErr.statusCode === 404) context.logger.error('AWS S3 File Not Found'); } 
        finally { profiler.done('Execution completed'); }
     } });
  }

}