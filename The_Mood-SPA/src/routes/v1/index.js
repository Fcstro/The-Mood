import { Router } from 'express';
import homeRouter from './homeRoutes.js';
import accountRouter from './accountRoutes.js';
import moodRouter from './moodRoutes.js'; 

const v1 = new Router();

v1.use('/account', accountRouter); 
v1.use('/moods', moodRouter); 
v1.use('/', homeRouter);

export default v1;