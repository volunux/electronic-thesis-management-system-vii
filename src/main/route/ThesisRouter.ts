import express , { Router } from 'express';
import { Thesis } from '../entity/Thesis';
import { ThesisCoverImage } from '../entity/ThesisCoverImage';
import { ThesisDocument } from '../entity/ThesisDocument';
import { AttachmentProps } from '../entity/interface/AttachmentProps';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { DocumentUploader } from '../helper/file/uploader/DocumentUploader';
import { ImageUploader } from '../helper/file/uploader/ImageUploader';
import S3SignedUrlGenerator from '../helper/file/S3SignedUrlGenerator';
import { ImageValidator } from '../helper/file/validator/ImageValidator';
import { DocumentValidator } from '../helper/file/validator/DocumentValidator';
import { FileConfigurerList } from '../util/aws/s3/FileConfigurerList';
import FileConfigurer from '../util/aws/s3/FileConfigurer';
import { ThesisController } from '../controller/ThesisController';
import { ThesisRouteConfig } from './config/ThesisRouteConfig';
import { UserProfile } from '../helper/middleware/UserProfile';
import ConfigurationProperties from '../config/ConfigurationProperties';

export const ThesisRouter : Router = express.Router();
const ctrl : ThesisController = ProxyController.create<ThesisController>(new ThesisController(ThesisRouteConfig.getInstance()));
const documentConfigurer : FileConfigurer = <FileConfigurer>FileConfigurerList.getFileConfigurer('image');
const imageConfigurer : FileConfigurer = <FileConfigurer>FileConfigurerList.getFileConfigurer('image');
const s3SignedUrlGenerator : S3SignedUrlGenerator = S3SignedUrlGenerator.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const documentUploader : DocumentUploader = DocumentUploader.getInstance(documentConfigurer.getS3Instance() , documentConfigurer.getConfiguration());
const imageUploader : ImageUploader = ImageUploader.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const imageValidator : ImageValidator = ImageValidator.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const documentValidator : DocumentValidator = DocumentValidator.getInstance(documentConfigurer.getS3Instance() , documentConfigurer.getConfiguration());
const thesisDocumentBucketName : string = "THESIS_DOC";
const thesisCoverImageBucketName : string = "THESIS_COVER_IMAGE";
const coverImage : AttachmentProps = { 'label' : 'Thesis Cover Image' , 'entityName' : 'ThesisCoverImage' };
const document : AttachmentProps = { 'label' : 'Thesis Document' , 'entityName' : 'ThesisDocument' };

ThesisRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("thesis") , ThesisController.setEntity(Thesis));
ThesisRouter.get('/' , ctrl.home);
ThesisRouter.get('/entries' , ctrl.findAll);
ThesisRouter.get('/submission' , ctrl.findAll);

let entryDetail : string[] = ['/submission/detail/:id' , '/detail/:id'];
ThesisRouter.get(entryDetail , ctrl.findOne);

let entryDetailPost : string[] = ['/detail/:id' , '/submission/detail/:id'];
ThesisRouter.post(entryDetailPost , ValidationRegister.setSchema('ThesisDetail') , ctrl.updateStatus);
ThesisRouter.get('/save/:thesis' , ctrl.entryDownload);
ThesisRouter.use('/add' , LayoutConfigurer.setLayout('rich'));
ThesisRouter.route('/add').get(ctrl.addOne).post(ValidationRegister.setSchema('Thesis') , UserProfile.verifyDepartmentAndFaculty , ctrl.save);
ThesisRouter.get('/update/:id' , ctrl.categoricalUpdate);
ThesisRouter.route('/detail/update/:id').get(ctrl.updateOne).post(ValidationRegister.setSchema('ThesisUpdate') , UserProfile.verifyDepartmentAndFaculty , ctrl.update);
ThesisRouter.use('/content/update/:id' , LayoutConfigurer.setLayout('rich'));
ThesisRouter.route('/content/update/:id').get(ctrl.updateOneContent).post(ValidationRegister.setSchema('ThesisContentUpdate') , ctrl.updateContent);
ThesisRouter.route('/delete/:id').get(ctrl.deleteOne).post(ValidationRegister.setSchema('ThesisDelete') , ctrl.delete);
ThesisRouter.route('/cover-image/update/:id').get(ctrl.updateOneThesisObject(ThesisCoverImage , coverImage.entityName))
    .post(imageUploader.getUploader(thesisCoverImageBucketName , 200 , 1 , 'thesis_cover_image' , 'image'), 
    imageUploader.checkFileUpload('image') , imageValidator.mimetype(thesisCoverImageBucketName , 'image') , imageUploader.validate(thesisCoverImageBucketName , 'image') ,
    imageUploader.checkFileSize(thesisCoverImageBucketName , 'image' , 200) , ThesisController.setThesisCoverImage , 
    ctrl.updateThesisObject(ThesisCoverImage , coverImage.entityName , thesisCoverImageBucketName));

ThesisRouter.route('/document/update/:id').get(ctrl.updateOneThesisObject(ThesisDocument , document.entityName))
    .post(documentUploader.getUploader(thesisDocumentBucketName , 1024 , 1 , 'thesis_document' , 'document' , 'private') , 
    documentUploader.checkFileUpload('document') , documentValidator.mimetype(thesisDocumentBucketName , 'document') , documentUploader.validate(thesisDocumentBucketName , 'document') ,
    documentUploader.checkFileSize(thesisDocumentBucketName , 'document' , 1024) , ThesisController.setThesisDocument ,
    ctrl.updateThesisObject(ThesisDocument , document.entityName , thesisDocumentBucketName));

ThesisRouter.post('/cover-image/hash/:filename' , s3SignedUrlGenerator.createSignedUrlPost(thesisCoverImageBucketName));
ThesisRouter.post('/document/hash/:filename' , s3SignedUrlGenerator.createSignedUrlPost(thesisDocumentBucketName , 'private'));
ThesisRouter.post('/cover-image/save/' , ThesisController.setThesisCoverImageII , ctrl.saveThesisObjectII(ThesisCoverImage , coverImage.entityName , thesisCoverImageBucketName));
ThesisRouter.post('/document/save/' , ThesisController.setThesisDocumentII , ctrl.saveThesisObjectII(ThesisDocument , document.entityName , thesisDocumentBucketName));
ThesisRouter.delete('/cover-image/:objectkey' , ctrl.deleteThesisObjectII(ThesisCoverImage , coverImage.entityName , thesisCoverImageBucketName));
ThesisRouter.delete('/document/:objectkey' , ctrl.deleteThesisObjectII(ThesisDocument , document.entityName , thesisDocumentBucketName));
ThesisRouter.delete('/cover-image/internal-delete/:objectkey' , s3SignedUrlGenerator.objectDeleteByKeyInternal(thesisCoverImageBucketName));
ThesisRouter.delete('/document/internal-delete/:objectkey' , s3SignedUrlGenerator.objectDeleteByKeyInternal(thesisDocumentBucketName));
ThesisRouter.post('/delete/entries/many' , ctrl.deleteMany);
ThesisRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);