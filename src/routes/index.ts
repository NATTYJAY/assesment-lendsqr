import { Request, Response, Router } from 'express';
import user from './user';
import auth from './auth';
const routes = Router();

routes.use('/v1/user', user);

routes.use('/v1/login',auth);

export { routes };
