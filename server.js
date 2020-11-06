const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({path: './config/config.env'});

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, 
  console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`) 
);

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR: ${err.message}`);
  // close server
  server.close(() => process.exit(1))
})
