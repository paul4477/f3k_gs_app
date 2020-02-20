
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

// Temp debug/test data
recordedScores = [
  {"id":1,"result":{"group":"02","round":"01","pilot":null,"times":[{"valid":true,"time":59.3},{"valid":false,"time":119.7},{"valid":true,"time":92.4},{"valid":true,"time":111.0},{"valid":true,"time":220.2}]}},
  {"id":2,"result":{"group":"03","round":"02","pilot":null,"times":[{"valid":true,"time":25.4},{"valid":true,"time":237.3},{"valid":true,"time":45.2}]}},
  {"id":3,"result":{"group":"04","round":"03","pilot":null,"times":[{"valid":true,"time":25.4},{"valid":true,"time":237.3},{"valid":true,"time":45.2}]}},
  {"id":4,"result":{"group":"05","round":"04","pilot":null,"times":[{"valid":true,"time":25.4},{"valid":true,"time":237.3},{"valid":true,"time":45.2}]}},
  {"id":5,"result":{"group":"06","round":"05","pilot":null,"times":[{"valid":true,"time":25.4},{"valid":true,"time":31.7},{"valid":true,"time":45.2},{"valid":true,"time":61},{"valid":true,"time":74},{"valid":true,"time":81},{"valid":true,"time":92.6},{"valid":true,"time":106},{"valid":true,"time":106},{"valid":true,"time":106},]}},
  {"id":6,"result":{"group":"02","round":"06","pilot":null,"times":[{"valid":true,"time":185.6}]}},
  
];


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