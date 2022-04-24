import { AbstractFileValidator } from './AbstractFileValidator';
import aws from 'aws-sdk';

export class ImageValidator extends AbstractFileValidator {

  private static instance: ImageValidator;

  constructor(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions) {
    super(s3Instance, s3Configuration);
  }

  public static getInstance(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions): ImageValidator {
    if (!ImageValidator.instance) { ImageValidator.instance = new ImageValidator(s3Instance, s3Configuration); }
    return ImageValidator.instance;
  }

}