import Router from 'koa-router';
import login from './login';
import me from './me';
import logout from './logout';
import authorize from '../../libs/middlewares/authorize';

const auth = new Router();

auth.post('/login', login);
auth.get('/me', authorize, me);
auth.post('/logout', logout);

export default auth;
