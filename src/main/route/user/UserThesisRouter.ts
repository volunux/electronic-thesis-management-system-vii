import express , { Router } from 'express';
import S3SignedUrlGenerator from '../../helper/file/S3SignedUrlGenerator';
import FileConfigurer from '../../util/aws/s3/FileConfigurer';
import { Thesis } from '../../entity/Thesis';
import { ThesisCoverImage } from '../../entity/ThesisCoverImage';
import { ThesisDocument } from '../../entity/ThesisDocument';
import { AttachmentProps } from '../../entity/interface/AttachmentProps';
import { ValidationRegister } from '../../helper/validation/register';
import { LayoutConfigurer } from '../../helper/view/LayoutConfigurer';
import { ProxyController } from '../../util/proxy/ProxyController';
import { UserProfile } from '../../helper/middleware/UserProfile';
import { DocumentUploader } from '../../helper/file/uploader/DocumentUploader';
import { ImageUploader } from '../../helper/file/uploader/ImageUploader';
import { ImageValidator } from '../../helper/file/validator/ImageValidator';
import { DocumentValidator } from '../../helper/file/validator/DocumentValidator';
import { FileConfigurerList } from '../../util/aws/s3/FileConfigurerList';
import { UserThesisController } from '../../controller/user/UserThesisController';
import { UserThesisRouteConfig } from '../config/UserThesisRouteConfig';

export const UserThesisRouter : Router = express.Router();

const ctrl : UserThesisController = ProxyController.create<UserThesisController>(new UserThesisController(UserThesisRouteConfig.getInstance()));
const documentConfigurer : FileConfigurer = <FileConfigurer>FileConfigurerList.getFileConfigurer('image');
const imageConfigurer : FileConfigurer = <FileConfigurer>FileConfigurerList.getFileConfigurer('image');
const documentUploader : DocumentUploader = DocumentUploader.getInstance(documentConfigurer.getS3Instance() , documentConfigurer.getConfiguration());
const s3SignedUrlGenerator : S3SignedUrlGenerator = S3SignedUrlGenerator.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const imageUploader : ImageUploader = ImageUploader.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const imageValidator : ImageValidator = ImageValidator.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const documentValidator : DocumentValidator = DocumentValidator.getInstance(documentConfigurer.getS3Instance() , documentConfigurer.getConfiguration());

const thesisDocumentBucketName : string = "THESIS_DOC";
const thesisCoverImageBucketName : string = "THESIS_COVER_IMAGE";
const coverImage : AttachmentProps = { 'label' : 'Thesis Cover Image' , 'entityName' : 'ThesisCoverImage' };
const document : AttachmentProps = { 'label' : 'Thesis Document' , 'entityName' : 'ThesisDocument' };

UserThesisRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("user-thesis") , UserThesisController.setEntity(Thesis));
UserThesisRouter.get('/' , ctrl.home);
UserThesisRouter.get('/entries' , ctrl.findAll);
UserThesisRouter.get('/delete-request' , LayoutConfigurer.setLayout("thesis-delete-request") , ctrl.findAllDeleteRequest);
UserThesisRouter.get('/delete-request/detail/:id' , ctrl.findOneDeleteRequest);
UserThesisRouter.get('/detail/:id' , ctrl.findOne);
UserThesisRouter.get('/save/:thesis' , ctrl.entryDownload);

UserThesisRouter.use('/add' , LayoutConfigurer.setLayout('rich'));
UserThesisRouter.route('/add').get(ctrl.showSubmissionView , ctrl.addOne).post(ValidationRegister.setSchema('UserThesis') , UserProfile.verifyDepartmentAndFaculty , ctrl.save);

UserThesisRouter.get('/update/:id' , ctrl.categoricalUpdate);
UserThesisRouter.route('/detail/update/:id').get(ctrl.updateOne).post(ValidationRegister.setSchema('UserThesisUpdate') , ctrl.update);

UserThesisRouter.use('/content/update/:id' , LayoutConfigurer.setLayout('rich'));
UserThesisRouter.route('/content/update/:id').get(ctrl.updateOneContent).post(ValidationRegister.setSchema('ThesisContentUpdate') , ctrl.updateContent);

UserThesisRouter.route('/delete/:id/:slug').get(ctrl.showDeleteRequestSubmissionView , ctrl.deleteOne)
.post(UserThesisController.setThesisDeleteRequest , ValidationRegister.setSchema('UserThesisDeleteRequest') , ctrl.delete);

UserThesisRouter.get('/cover-image/update/:id' , ctrl.updateOneThesisObject(ThesisCoverImage , coverImage.entityName));
UserThesisRouter.post('/cover-image/update/:id' , imageUploader.getUploader(thesisCoverImageBucketName , 200 , 1 , 'thesis_cover_image' , 'image'), imageUploader.checkFileUpload('image') , 
    imageValidator.mimetype(thesisCoverImageBucketName , 'image') , imageUploader.validate(thesisCoverImageBucketName , 'image') ,
    imageUploader.checkFileSize(thesisCoverImageBucketName , 'image' , 200) , UserThesisController.setThesisCoverImage ,
    ctrl.updateThesisObject(ThesisCoverImage , coverImage.entityName , thesisCoverImageBucketName));

UserThesisRouter.get('/document/update/:id' , ctrl.updateOneThesisObject(ThesisDocument , document.entityName));
UserThesisRouter.post('/document/update/:id' , documentUploader.getUploader(thesisDocumentBucketName , 1024 , 1 , 'thesis_document' , 'document' , 'private') , 
    documentUploader.checkFileUpload('document') , documentValidator.mimetype(thesisDocumentBucketName , 'document') , documentUploader.validate(thesisDocumentBucketName , 'document') ,
    documentUploader.checkFileSize(thesisDocumentBucketName , 'document' , 1024) , UserThesisController.setThesisDocument ,
    ctrl.updateThesisObject(ThesisDocument , document.entityName , thesisDocumentBucketName));

UserThesisRouter.post('/cover-image/hash/:filename' , s3SignedUrlGenerator.createSignedUrlPost(thesisCoverImageBucketName));
UserThesisRouter.post('/document/hash/:filename' , s3SignedUrlGenerator.createSignedUrlPost(thesisDocumentBucketName , 'private'));

UserThesisRouter.post('/cover-image/save/' , UserThesisController.setThesisCoverImageII , ctrl.saveThesisObjectII(ThesisCoverImage , coverImage.entityName , thesisCoverImageBucketName));
UserThesisRouter.post('/document/save/' , UserThesisController.setThesisDocumentII , ctrl.saveThesisObjectII(ThesisDocument , document.entityName , thesisDocumentBucketName));

UserThesisRouter.delete('/cover-image/:objectkey' , ctrl.deleteThesisObjectII(ThesisCoverImage , coverImage.entityName , thesisCoverImageBucketName));
UserThesisRouter.delete('/document/:objectkey' ,  ctrl.deleteThesisObjectII(ThesisDocument , document.entityName , thesisDocumentBucketName));

UserThesisRouter.delete('/cover-image/internal-delete/:objectkey' , s3SignedUrlGenerator.objectDeleteByKeyInternal(thesisCoverImageBucketName));
UserThesisRouter.delete('/document/internal-delete/:objectkey' ,  s3SignedUrlGenerator.objectDeleteByKeyInternal(thesisDocumentBucketName));