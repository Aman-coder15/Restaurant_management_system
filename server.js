require('dotenv').config(); // load environment variable 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const rmsRoutes = require('./routes/rmsRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // JSON parser

// database connection (use local or mongo atlas url)
mongoose.connect( process.env.MONGO_URI || 'mongodb://localhost:27017/rms_db')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// routing mounts karna
app.use('/api', rmsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running securely on port ${PORT}`));
