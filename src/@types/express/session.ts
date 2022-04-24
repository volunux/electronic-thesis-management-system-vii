import { Express } from 'express';
import { Session , SessionData } from 'express-session';
import { ShoppingCart } from '../../main/entity/ShoppingCart';

declare module 'express-session' {

	interface SessionData {
		cart : ShoppingCart
	}

}