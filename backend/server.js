import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { initializeWorkbookStorage } from './utils/bootstrapExcel.js';

const app = express();
const PORT = process.env.PORT || 5000;

initializeWorkbookStorage();

app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Learning Tracker API is running' });
});

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
