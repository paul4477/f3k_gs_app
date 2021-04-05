const ftpServer = require('ftp-srv'); 
const config = require('config');
  
const server = new ftpServer({ 
    //url: 'ftp://0.0.0.0:21',
    url: `ftp://${config.get("ftp.IP")}:${config.get("ftp.port")}`,
    pasv_url: config.get("ftp.pasvIP"),
    pasv_min: 8400,
    pasv_max: 8500,
    //timeout: 30,
  }); 
  
server.on('login', ({ connection, username, password }, resolve, reject) => { 
      console.log("login");
      resolve({root:"."}); 
      //resolve();
      console.log("resolved");
      connection.on('STOR', (error, fileName) => { 
        if (error) { 
          console.error(`FTP server error: could not receive file ${fileName} for upload ${error}`); 
        } 
        console.info(`FTP server: upload successfully received - ${fileName}`); 
      }); 

      //console.log(connection); 
  }); 
  
server.on('client-error', ({ context, error }) => { 
    console.error(`FTP server error: error interfacing with client ${context} ${error}  ${JSON.stringify(error)}`); 
  }); 
  
server.listen().then(()=>{
  console.log("listening PASV:",config.get("ftp.pasvIP") );
})

module.exports = server;