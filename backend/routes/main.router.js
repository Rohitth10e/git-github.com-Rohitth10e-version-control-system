import express from 'express';
import issueRouter from './issue.router.js';
import repoRouter from './repo.router.js';
import userRouter from './user.router.js';

const mainRouter = express.Router();

mainRouter.use(issueRouter);
mainRouter.use(repoRouter);
mainRouter.use(userRouter);

export default mainRouter;