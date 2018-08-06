var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Business_1',
  database: 'app1'
});


 
var queryString = 'select * from tHdata ';
var results = [];
 
//initialize connection 
connection.connect(function (err) {
  if (err) {
    console.error("error connection: ");
    return;
  }
  console.log('Demo connection sueccess! ');
});
//queryString = 'select * from uAccount';

connection.query(queryString, function (err, rows, fields) {
  if (err) throw err;
  console.log('----------Demo select --------');
  console.log(rows);

  for (i in rows) {
    results.push(rows[i]);
  };
});

console.log('-------get to page------');
  



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
  /*
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Business_1',
    database: 'app1'
  });
  connection.connect(function (err) {
  if (err) {
    console.error("error connection: ");
    return;
  }
  console.log('Demo connection sueccess! ');
});
  query = 'select * from tHdata where userAccount= ' + ctx.request.query.account;
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    console.log('----------Demo select --------');
    console.log(rows);

    for (i in rows) {
      results.push(rows[i]);
    };
  }); 
   */

  ctx.response.type = 'JSON';
  //responce body
  ctx.body = JSON.stringify(results);
  connection.end();
};
 
//connection.end();
