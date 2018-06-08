//variables
const http = require('http');
const mysql = require('mysql');
//mysql configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee',
  charset: 'utf8'
});

//html string that will be send to browser
var reo ='<html><head><title>Employee</title></head><body align=center><h1>List of Employee</h1>{${table}}</body></html>';

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
function setResHtml(sql, cb){
  pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ res[i].id +'</td><td>'+ res[i].name +'</td><td>'+ res[i].department +'</td></tr>';
      }
      table ='<table border="1" align=center><tr><th>id</th><th>Name</th><th>Department</th></tr>'+ table +'</table>';

      con.release(); //Done with mysql connection

      return cb(table);
    });
  });
}

let sql ='SELECT * FROM emp';

//create the server for browser access
const server = http.createServer((req, res)=>{
  setResHtml(sql, resql=>{
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo, 'utf-8');
    res.end();
  });
});

server.listen(8080, ()=>{
  console.log('Server running at //localhost:8080/');
});