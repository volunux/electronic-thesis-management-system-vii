import { Express } from 'express';
import { Session , SessionData } from 'express-session';
import { ValidationErrors } from '../../main/helper/validation/ValidationErrors';
import { EntityQueryConfig } from '../../main/model/query/util/EntityQueryConfig';
import { UserSession } from '../../main/entity/UserSession';
import { EntityAll } from '../../main/entity/abstract/EntityAll';

declare global {
	namespace Express {
		interface Request {
			validationErrors : ValidationErrors;
			user : UserSession | Express.User;
			flash : any;
			validationErrorTypeList : Set<string>;
			queryConfig : EntityQueryConfig;
			bindingModel  : Object | null;
			multipartFile : Object;
		}
	}

}