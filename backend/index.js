const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();
const PORT = 3000;

//Database Connection
const connectDB = require('./config/db');
connectDB();

// Middleware (optional)
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/test', require('./routes/testRoutes'));

app.use('/api/flashCard', require('./routes/flashCardRoutes'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
