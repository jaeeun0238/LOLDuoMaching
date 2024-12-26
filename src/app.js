import express from 'express';
import userRouter from './routers/user.router.js';
import errorMiddleware from './middlewares/error.middleware.js';
import profileRouter from './routers/profiles.router.js';
import postRouter from './routers/posts.router.js';
import duoReviewRouter from './routers/duoreview.router.js';
import commentRouter from './routers/comments.router.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', [
  userRouter,
  profileRouter,
  postRouter,
  duoReviewRouter,
  commentRouter,
]);
app.use(errorMiddleware);
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
