const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const morgan = require('morgan');
const colors = require('colors')
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');
const path = require('path');

dotenv.config({path: './config/config.env'});

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(fileUpload());

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses)

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, 
  console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow) 
);

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR: ${err.message}`.red);
  // close server
  server.close(() => process.exit(1))
})
