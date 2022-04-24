import express , { Router } from 'express';
import { ValidationRegister } from '../helper/validation/register';
import { ProxyController } from '../util/proxy/ProxyController';
import { UserProfile } from '../helper/middleware/UserProfile';
import { HomeController } from '../controller/HomeController';
import { ShoppingController } from '../controller/ShoppingController';
import { HomeRouteConfig } from './config/HomeRouteConfig';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';

export const HomeRouter : Router = express.Router();
const ctrl : HomeController = ProxyController.create<HomeController>(new HomeController(HomeRouteConfig.getInstance()));
const ctrl2 : ShoppingController = ProxyController.create<ShoppingController>(new ShoppingController());


HomeRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("main"));
HomeRouter.get('/more' , ctrl.more);
HomeRouter.get('/dashboard' , UserProfile.isAuthenticated , ctrl.dashboard);
HomeRouter.get('/about' , ctrl.about);
HomeRouter.get('/contact' , ctrl.contact);
HomeRouter.use('/cart' , LayoutConfigurer.setLayout('cart'));
HomeRouter.get('/cart' , ctrl2.showCart);
HomeRouter.post('/cart' , ShoppingController.setOrderItem , ctrl2.addItemToCart);
HomeRouter.post('/cart/update' , ShoppingController.setOrderItem , ctrl2.updateCartItem);
HomeRouter.post('/cart/clear' , ctrl2.clearCart);
HomeRouter.get('/cart/checkout' , UserProfile.isAuthenticated , ctrl2.verifyOrderItemExistingAndPrice , ctrl2.proceedToCheckOut);
HomeRouter.post('/cart/checkout' , UserProfile.isAuthenticated , ShoppingController.setCheckoutForm , ValidationRegister.setSchema('Checkout') ,  ctrl2.processCheckout);
HomeRouter.get('/cart/delete/:item_id' , ctrl2.removeCartItem);
HomeRouter.get('/sign-in' , UserProfile.noAuthentication , UserProfile.loginAttempt , ctrl.signIn);
HomeRouter.post('/sign-in' , UserProfile.noAuthentication , UserProfile.loginAttempt , HomeController.setUser , ValidationRegister.setSchema('Authentication') , ctrl.signInAccount);
HomeRouter.get('/sign-up' , UserProfile.noAuthentication , ctrl.signUp);
HomeRouter.post('/sign-up' , UserProfile.noAuthentication , HomeController.setUser , ValidationRegister.setSchema('AuthSignUp') , ctrl.signUpAccount);
HomeRouter.get('/sign-out' , UserProfile.logOut , ctrl.signOut);
HomeRouter.get('/forgot-password' , ctrl.forgotPassword);
HomeRouter.post('/forgot-password' , HomeController.setForgotPassword , ValidationRegister.setSchema('ForgotPassword') , ctrl.forgotPasswordConfirm);
HomeRouter.get('/reset/:token' , ctrl.resetPassword);
HomeRouter.post('/reset/:token' , HomeController.setPasswordChange , ValidationRegister.setSchema('ResetPassword') , ctrl.saveNewPassword);
HomeRouter.get('/payment/validation' , UserProfile.isAuthenticated , ctrl2.verifyOrder);