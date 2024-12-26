import express from 'express';
import userRouter from './routers/user.router.js';
import errorMiddleware from './middlewares/error.middleware.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', [profilesRouter, postsRouter, CommentsRouter, DuoReviewRouter]);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
