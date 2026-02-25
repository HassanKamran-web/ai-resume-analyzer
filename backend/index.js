const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');
const cors = require('cors');
const uploadRoutes = require('./routes/file.route');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', uploadRoutes);
app.get('/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});




app.listen(port);