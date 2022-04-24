import { Logger } from 'winston';
import FileConfigurerImpl from '../../util/aws/s3/FileConfigurerImpl';
import ConfigurationProperties from '../../config/ConfigurationProperties';
import aws from 'aws-sdk';
import SimpleLogger from '../../util/other/Logger';

aws.config.update(FileConfigurerImpl.getInstance().getConfiguration());
const s3: aws.S3 = new aws.S3();

export default class S3ObjectChange {

  private static readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private static readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': S3ObjectChange.name });

  public static async objectDeleteByLocation(objPath: string, bucketName: string): Promise<void> {
    let pathKey: string[] = objPath.split('/');
    let key: string = pathKey.pop() as string;
    let params: aws.S3.DeleteObjectRequest = { 'Bucket': this.eProps.getS3BucketName(bucketName), 'Key': key };
    try {
      let deleteObjectOutput: aws.S3.DeleteObjectOutput = await s3.deleteObject(params).promise();
      this.logger.info("Entry or Entries deleted successfully");
    }
    catch (err: any) { this.logger.error(err); }
  }

  public static deleteMany(documents: Express.MulterS3.File[], bucketName: string): void {
    let itemKeys: any[] = [];
    documents.forEach((item: Express.MulterS3.File) => { itemKeys.push({ 'Key': item.key.split('\\').pop() }); });
    let params: aws.S3.DeleteObjectsRequest = { 'Bucket': this.eProps.getS3BucketName(bucketName), 'Delete': { 'Objects': itemKeys } };
    s3.deleteObjects(params, (err: aws.AWSError, deleted: aws.S3.DeleteObjectOutput) => {
      if (err) { this.logger.error(err); }
      else { this.logger.info("Entry or Entries deleted successfully"); }
    });
  }

  public static async objectDeleteByKey(key: string, bucketName: string): Promise<aws.Request<aws.S3.DeleteObjectOutput, aws.AWSError>> {
    let params: aws.S3.DeleteObjectRequest = { 'Bucket': this.eProps.getS3BucketName(bucketName), 'Key': key };
    return s3.deleteObject(params);
  }

}