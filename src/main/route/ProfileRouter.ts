import express , { Router } from 'express';
import FileConfigurer from '../util/aws/s3/FileConfigurer';
import { UserProfile } from '../helper/middleware/UserProfile';
import { User } from '../entity/User';
import { UserDto } from '../entity/dto/UserDto';
import { UserProfilePhoto } from '../entity/UserProfilePhoto';
import { UserSignature } from '../entity/UserSignature';
import { AttachmentProps } from '../entity/interface/AttachmentProps';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { FileConfigurerList } from '../util/aws/s3/FileConfigurerList';
import { ImageUploader } from '../helper/file/uploader/ImageUploader';
import { ImageValidator } from '../helper/file/validator/ImageValidator';
import S3SignedUrlGenerator from '../helper/file/S3SignedUrlGenerator';
import { ProfileController } from '../controller/ProfileController';
import { ProfileRouteConfig } from './config/ProfileRouteConfig';
import { HomeController } from '../controller/HomeController';

export const ProfileRouter : Router = express.Router();
const imageConfigurer : FileConfigurer = <FileConfigurer>FileConfigurerList.getFileConfigurer('image');
const imageUploader : ImageUploader = ImageUploader.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const s3SignedUrlGenerator : S3SignedUrlGenerator = S3SignedUrlGenerator.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const imageValidator : ImageValidator = ImageValidator.getInstance(imageConfigurer.getS3Instance() , imageConfigurer.getConfiguration());
const ctrl : ProfileController = ProxyController.create<ProfileController>(new ProfileController(ProfileRouteConfig.getInstance()));
const profileBucketName : string = "THESIS_USER";
const profilePhoto : AttachmentProps = { 'label' : 'User Profile Photo' , 'entityName' : 'UserProfilePhoto' };
const signature : AttachmentProps = { 'label' : 'User Signature' , 'entityName' : 'UserSignature' };

ProfileRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout('profile') , ProfileController.setEntity(User));
ProfileRouter.use('/profile-photo' , LayoutConfigurer.setLayout('profile'));
ProfileRouter.use('/signature' , LayoutConfigurer.setLayout('profile'));
ProfileRouter.get('/' , ctrl.home);
ProfileRouter.get('/entries/' , ctrl.entries);
ProfileRouter.get('/detail/' , ctrl.findOne);

ProfileRouter.route('/update/').get(ctrl.updateOne).post(ValidationRegister.setSchema('ProfileUpdate') , ProfileController.setEntity(UserDto) , UserProfile.verifyDepartmentAndFaculty , ctrl.update);
ProfileRouter.get('/delete/profile-photo' , ctrl.deleteOneObject(UserProfilePhoto , profilePhoto.label));
ProfileRouter.post('/delete/profile-photo' , ctrl.deleteUserObject(UserProfilePhoto , profilePhoto.entityName , profileBucketName , profilePhoto.label));
ProfileRouter.get('/delete/signature' , ctrl.deleteOneObject(UserSignature , signature.label));
ProfileRouter.post('/delete/signature' , ctrl.deleteUserObject(UserSignature , signature.entityName , profileBucketName , signature.label));
ProfileRouter.route('/password-change/').get(ctrl.changeOnePassord).post(HomeController.setPasswordChange , ValidationRegister.setSchema('PasswordChange') , ctrl.changePassord);
ProfileRouter.route('/deactivate/').get(ctrl.deactivateOne).post(ctrl.deactivate);
ProfileRouter.route('/reactivate/').get(ctrl.reactivateOne).post(ctrl.reactivate);

ProfileRouter.get('/profile-photo/' , ctrl.addObject(UserProfilePhoto , profilePhoto.entityName));
ProfileRouter.post('/profile-photo/' , imageUploader.getUploader(profileBucketName , 200 , 1 , 'profile_photo' , 'image') , imageUploader.checkFileUpload('image') ,
    imageValidator.mimetype(profileBucketName , 'image') , imageUploader.validate(profileBucketName , 'image') ,
    imageUploader.checkFileSize(profileBucketName , 'image' , 200) , ProfileController.setUserObject(UserProfilePhoto) , 
    ctrl.saveObject(UserProfilePhoto , profilePhoto.entityName , profileBucketName));

ProfileRouter.get('/signature/' , ctrl.addObject(UserSignature , signature.entityName));
ProfileRouter.post('/signature/' , imageUploader.getUploader(profileBucketName , 200 , 1 , 'profile_signature' , 'image') , 
    imageUploader.checkFileUpload('image') , imageValidator.mimetype(profileBucketName , 'image') , imageUploader.validate(profileBucketName , 'image') ,
    imageUploader.checkFileSize(profileBucketName , 'image' , 200) , ProfileController.setUserObject(UserSignature) , 
    ctrl.saveObject(UserSignature , signature.entityName , profileBucketName));

ProfileRouter.post('/profile-photo/hash/:filename' , s3SignedUrlGenerator.createSignedUrlPost(profileBucketName));
ProfileRouter.post('/signature/hash/:filename' , s3SignedUrlGenerator.createSignedUrlPost(profileBucketName));
ProfileRouter.post('/profile-photo/save/' , ProfileController.setUserObjectII(UserProfilePhoto) , ctrl.saveUserObjectII(UserProfilePhoto , profilePhoto.entityName , profileBucketName));
ProfileRouter.post('/signature/save/' , ProfileController.setUserObjectII(UserSignature) , ctrl.saveUserObjectII(UserSignature , signature.entityName , profileBucketName));
ProfileRouter.delete('/profile-photo/:objectkey' , ctrl.deleteUserObjectII(UserProfilePhoto , profilePhoto.entityName , profileBucketName));
ProfileRouter.delete('/signature/:objectkey' ,  ctrl.deleteUserObjectII(UserSignature , signature.entityName , profileBucketName));