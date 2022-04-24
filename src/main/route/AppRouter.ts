import { Express } from 'express';
import { FormValidation } from '../helper/middleware/FormValidation';
import { QueryConfigImpl } from '../helper/middleware/QueryConfigImpl';
import { UserProfile } from '../helper/middleware/UserProfile';
import { UserPermission } from '../helper/middleware/UserPermission';
import { GeneralMiddleware } from '../helper/middleware/GeneralMiddleware';
import { LoginAttemptMiddleware } from '../helper/middleware/LoginAttemptMiddleware'; 
import { CsrfConfig } from '../config/CsrfConfig';

import { HomeRouter } from './HomeRouter';
import { InternalRouter } from './InternalRouter';
import { LoggerRouter } from './LoggerRouter';
import { DownloadRouter } from './DownloadRouter';
import { AdminRouter } from './AdminRouter';
import { CountryRouter } from './CountryRouter';
import { DepartmentRouter } from './DepartmentRouter';
import { FacultyRouter } from './FacultyRouter';
import { LevelRouter } from './LevelRouter';
import { RoleRouter } from './RoleRouter';
import { UserSession } from '../entity/UserSession';
import { OrderStatusRouter } from './OrderStatusRouter';
import { ThesisStatusRouter } from './ThesisStatusRouter';
import { ThesisDeleteRequestRouter } from './ThesisDeleteRequestRouter';
import { ThesisDeleteRequestStatusRouter } from './ThesisDeleteRequestStatusRouter';
import { UserStatusRouter } from './UserStatusRouter';
import { PublisherRouter } from './PublisherRouter';
import { PaymentMethodRouter } from './PaymentMethodRouter';
import { DeliveryMethodRouter } from './DeliveryMethodRouter';
import { ThesisGradeRouter } from './ThesisGradeRouter';
import { ThesisCommentRouter } from './ThesisCommentRouter';
import { ThesisReplyRouter } from './ThesisReplyRouter';
import { ThesisRouter } from './ThesisRouter';
import { UserThesisRouter } from './user/UserThesisRouter';
import { GeneralThesisRouter } from './user/GeneralThesisRouter';
import { UserRouter } from './UserRouter';
import { ProfileRouter } from './ProfileRouter';
import { OrderRouter } from './OrderRouter';
import { UserOrderRouter } from './UserOrderRouter';
import { AttachmentRouter } from './AttachmentRouter';
import { RestRouter } from './RestRouter';
import { GeneralThesisController } from '../controller/user/GeneralThesisController';

export function AppRouter(app : Express) {

    app.use('/api' , AttachmentRouter);
    CsrfConfig.init(app);

    app.use('*' , UserProfile.setUserProfile);
    app.use(QueryConfigImpl.execute);
    app.use(FormValidation.execute);
    app.use(LoginAttemptMiddleware.execute);
    app.use('*' , UserProfile.isUserLoggedIn);
    app.use(GeneralMiddleware.messageFlash , GeneralMiddleware.validationErrors);
    app.use(/^(.*)\/entries\/?$/i , GeneralMiddleware.searchFilter , GeneralMiddleware.pageFiltering);
    app.use('/', GeneralThesisRouter);
    app.use('/', HomeRouter);
    app.use('/api' , RestRouter);

    app.use('*' , UserProfile.isAuthenticated);
    app.use('/profile' , ProfileRouter);
    app.use('/thesis/user' , UserThesisRouter);
    app.use('/order/user' , UserOrderRouter);
    app.use('/download/user' , DownloadRouter);
    app.use('/internal/', UserPermission.isUserPermitted(['superAdministrator' , 'administrator']));
    app.use('/internal/' , InternalRouter);
    app.use('/internal/admin', AdminRouter);

    /** Logger Routing under development **/
    app.use('/internal/admin/log' , UserPermission.isUserPermitted(['Owner']) , LoggerRouter);

    app.use('/internal/department', DepartmentRouter);

    app.use('/internal/country' , CountryRouter);
    app.use('/internal/faculty' , FacultyRouter);
    app.use('/internal/level' , LevelRouter);
    
    app.use('/internal/role' , RoleRouter);
    app.use('/internal/thesis-grade' , ThesisGradeRouter);

    app.use('/internal/order-status' , OrderStatusRouter);
    app.use('/internal/user-status' , UserStatusRouter);
    app.use('/internal/thesis-delete-request' , ThesisDeleteRequestRouter);
    app.use('/internal/thesis-delete-request-status' , ThesisDeleteRequestStatusRouter);
    app.use('/internal/thesis-status' , ThesisStatusRouter);
    
    app.use('/internal/publisher' , PublisherRouter);
    app.use('/internal/payment-method' , PaymentMethodRouter);
    app.use('/internal/delivery-method' , DeliveryMethodRouter);
    app.use('/internal/order' , OrderRouter);

    app.use('/internal/thesis' , ThesisRouter);
    app.use('/internal/user' , UserRouter);


    app.use('/internal/thesis-comment' , ThesisCommentRouter);
    app.use('/internal/thesis-reply' , ThesisReplyRouter);
    

    app.use('/*' , GeneralThesisController.noResource);
}