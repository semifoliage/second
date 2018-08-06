//aSample.js

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Business_1',
  database: 'app1'
});


//queryString = 'INSERT INTO sample2  SET ? ';
queryString='select * from sample2';
var results = {
  
  "userAccount": Date.now().toLocaleString,
  }

//initialize connection 
connection.connect(function (err) {
  if (err) {
    console.error("error connection: ");
    return;
  }
  console.log('Sample MySQL connection sueccess! ');
});
//queryString = 'select * from uAccount';

connection.query(queryString, function (err, rows) {
  if (err) throw err;
  console.log('----------sample query start --------');
  console.log(rows);

   
});

console.log('-------close connection------');
connection.end(function(err){
  if (err) {
    console.log('close connection error -->');
    throw err
  };
});



module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  /*if (ctx.state.$wxInfo.loginState === 1) {
      // loginState 为 1，登录态校验成功
      ctx.state.data = ctx.state.$wxInfo.userinfo
  } else {
      ctx.state.code = -1
  }*/
  ctx.response.type = 'JSON';
  //responce body
  ctx.body = JSON.stringify(results);
};

