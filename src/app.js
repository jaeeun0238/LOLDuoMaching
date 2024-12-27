// app.js

import express from 'express';
import championRoutes from './routes/champions.router.js';

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 연결
app.use('/api', championRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
