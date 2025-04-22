import { Router } from 'express'; 
import AccountController from '../../controllers/v1/accountController.js';
import authorization from '../../middlewares/authorization.js'; 
import authentication from '../../middlewares/authentication.js'; 
import upload from '../../middlewares/upload.js';


const accountRouter = new Router();
const account = new AccountController();

accountRouter.use(authorization);


accountRouter.post('/', account.create.bind(account));
accountRouter.post('/login', account.login.bind(account));
accountRouter.get('/profile', authentication, account.profile.bind(account));
accountRouter.get('/profile/:userId', account.getProfileById.bind(account));
accountRouter.put('/', authentication, account.updateProfile.bind(account));
accountRouter.post('/logout', authentication, account.logout.bind(account));
accountRouter.post('/password/forgot',account.forgotPassword.bind(account));

accountRouter.put('/password/reset', authentication, account.resetPassword.bind(account));
accountRouter.get('/search/users', authentication, account.searchUsers.bind(account)); 

accountRouter.post('/follow', authentication, account.follow.bind(account));
accountRouter.post('/unfollow', authentication, account.unfollow.bind(account)); 
accountRouter.get('/following', authentication, account.getFollowing.bind(account)); 
accountRouter.get('/followers', authentication, account.getFollowers.bind(account));

accountRouter.post('/profile-image', authentication, upload.single('profileImage'), account.uploadProfileImage.bind(account));
accountRouter.put('/profile-image', authentication, upload.single('profileImage'), account.updateProfileImage.bind(account));
accountRouter.delete('/profile-image', authentication, account.deleteProfileImage.bind(account));

accountRouter.post('/header-image', authentication, upload.single('headerImage'), account.uploadHeaderImage.bind(account));
accountRouter.put('/header-image', authentication, upload.single('headerImage'), account.updateHeaderImage.bind(account));
accountRouter.delete('/header-image', authentication, account.deleteHeaderImage.bind(account));

export default accountRouter;