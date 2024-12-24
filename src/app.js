import express from 'express';
import { createServer } from 'http';
import profilesRouter from './routes/profiles.router.js';
import postsRouter from './routes/posts.router.js';
import CommentsRouter from './routes/comments.router.js';
import DuoReviewRouter from './routes/duoreview.router.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', [profilesRouter, postsRouter, CommentsRouter, DuoReviewRouter]);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
