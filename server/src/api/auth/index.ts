import Router from 'koa-router';
import login from './login';
import me from './me';
import logout from './logout';

const auth = new Router();

auth.post('/login', login);
auth.get('/me', me);
auth.post('/logout', logout);

export default auth;
