import express from 'express';
import userRouter from './routers/user.router.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', [userRouter]);
app.use(errorMiddleware);
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
