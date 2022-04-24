import AbstractFileUploader from './AbstractFileUploader';
import aws from 'aws-sdk';

export class DocumentUploader extends AbstractFileUploader {

  private static instance: DocumentUploader;

  constructor(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions) { super(s3Instance, s3Configuration); }

  public static getInstance(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions): DocumentUploader {
    if (!DocumentUploader.instance) { DocumentUploader.instance = new DocumentUploader(s3Instance, s3Configuration); }
    return DocumentUploader.instance;
  }

}