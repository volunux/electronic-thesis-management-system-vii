import { AbstractFileValidator } from './AbstractFileValidator';
import aws from 'aws-sdk';

export class DocumentValidator extends AbstractFileValidator {

  private static instance: DocumentValidator;

  constructor(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions) { super(s3Instance, s3Configuration); }

  public static getInstance(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions): DocumentValidator {
    if (!DocumentValidator.instance) { DocumentValidator.instance = new DocumentValidator(s3Instance, s3Configuration); }
    return DocumentValidator.instance;
  }

}