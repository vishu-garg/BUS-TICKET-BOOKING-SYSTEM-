var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'brkye07tma9pxxpzibpo-mysql.services.clever-cloud.com', // Replace with your host name
  user: 'u1xyzbbv3nykeb0g',      // Replace with your database username
  password: 'HKN17NpTOu10jtkAAVT7',      // Replace with your database password
  database: 'brkye07tma9pxxpzibpo' // // Replace with your database Name
}); 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;


