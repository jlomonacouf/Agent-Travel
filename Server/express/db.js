var mysql = require('mysql');
var config = require('./config/config');

const con = mysql.createConnection({
    host: config.rdsDB.host,
    user: config.rdsDB.username,
    password: config.rdsDB.password,
    database: config.rdsDB.dbName,
    typeCast: function castField( field, useDefaultTypeCasting ) {
      if(field.type === "BIT" && field.length === 1) {
        var bytes = field.buffer();

        return(bytes[0] === 1);
      }
      return(useDefaultTypeCasting());
    }
});
  
con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');

});

module.exports = con;