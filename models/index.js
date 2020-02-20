var fs = require('fs');

/*
 * initializes all models
 */
fs.readdirSync(__dirname).forEach(function(file) {
  console.log(file);
  
    if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    exports[moduleName] = require('./' + moduleName);
  }
});