//startInfoSv.js
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Business_1',
  database: 'app1'
});
 
     
    
   
    /*
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
      connection.end();
    */

 

 
module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  /*
  if (ctx.state.$wxInfo.loginState === 1) {
      // loginState 为 1，登录态校验成功
      ctx.state.data = ctx.state.$wxInfo.userinfo
  } else {
      ctx.state.code = -1
  }
  */
  var results = [];
  var data=[];
  var queryString = 'select * from tHdata where userAccount= ?' ; 
  
  connection.connect(function (err) {
    if (err) {
      console.error("error connection: ");
      return;
    }
    console.log('Demo connection sueccess! ');
  });

  data.push(ctx.request.query.userAccount);
  
  connection.query(queryString, data, function (err, rows, fields) {
    if (err) throw err;
    console.log('----------StartInfo select --------');
    console.log(rows);

    iss=rows.length;
    for (i in rows) {
      results.push(rows[i]);
    };
  });

  console.log('-------StartInfo close connection------');
  connection.end();
  

  ctx.response.type = 'text';
  //responce body
  ctx.body = JSON.stringify(results);
  
};



//connection.end();
