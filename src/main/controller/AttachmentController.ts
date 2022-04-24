import { Request, Response, NextFunction } from 'express';
import ConfigFilePaths from '../config/ConfigFilePaths';
import ConfigurationProperties from '../config/ConfigurationProperties';
import { froalaS3 } from '../util/aws/s3/froalaS3';

export class AttachmentController {

  private eProps: ConfigurationProperties = ConfigurationProperties.getInstance();

  public async generateUploadHash(req: Request, res: Response, next: NextFunction): Promise<void> {
    let configs: { [key: string]: any } = {
      'bucket': this.eProps.getPostBucket(),
      'region': this.eProps.getS3UserRegion(),
      'keyStart': '',
      'acl': 'public-read-write',
      'secretKey': this.eProps.getS3UserSecretKey(),
      'accessKey': this.eProps.getS3UserAccessKey()
    };
    let s3Hash = froalaS3.getHash(configs);
    res.json(s3Hash);
  }

}