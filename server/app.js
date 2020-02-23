
const express = require('express');
const config = require('config');
//const Joi = require('@hapi/joi');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/f3k_test1')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB"));



const logger = (req, res, next) => {
  console.log("URL:", req.originalUrl, req.connection.remoteAddress);
  next();
}
const app = express();
app.use(logger);
app.use(express.json());

// Static files in public
app.use(express.static(path.join(__dirname, 'public')));

// API and utilities
var apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// User viewable pages
var uiRouter = require('./routes/ui');
app.use('/ui', uiRouter);

// GliderScore.com emulation
var scoringdataupload = require('./routes/scoringdataupload');
app.use('/', scoringdataupload);
var scoringdatadownload = require('./routes/scoringdatadownload');
app.use('/', scoringdatadownload);
var scoringdatamanage = require('./routes/scoringdatamanage');
app.use('/', scoringdatamanage);

// GliderScore.com FTP emulation
const ftpd = require('./routes/ftpServer');

// http://gliderscore.com/onlinescores.aspx?ID=1FC5445848ec&T=F
// Translate this to native score page

// set NODE_ENV=pdr-dev
// to use the pdr-dev config file
const port = config.get("http.port");
const host = config.get("http.IP");
app.listen(port, () => console.log(`Listening on port ${port}`));