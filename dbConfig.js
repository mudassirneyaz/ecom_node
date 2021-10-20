const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecomdb'
})

connection.connect((err)=>
{
    if (err){
        console.log("Error occured while connecting DB",err);
    }
    else{
        console.log("Connected to DB");
    }
})

module.exports = connection;

