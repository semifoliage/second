//queryuserSv.js

module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  await next();
  //response type
  ctx.response.type='text/html';
  //responce body
  ctx.response.body='this is queryuser page';
}


/*module.exports = async (ctx, next) => {
    var mysql = require('mysql');
    var connction = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Business_1',
      database: 'app1'
    });

    queryString = 'select * from uAccount';
    var results = [];

    //initialize connection 
    connection.connect(function (err) {
      if (err) {
        console.error("error connection: ");
        return;
      }
      console.log('connection sueccess! ');
    });
    queryString = 'select * from uAccount';

    connection.query(queryString, function (err, rows, fields) {
      if (err) throw err;
      console.log('----------select --------');
      console.log(rows);

      for (i in rows) {
        results.push(rows[i]);
      };
    });

    console.log('-------get to page------');
    router.get('/', function (req, res) {
      res.end(JSON.stringify(results));
    });

    connction.end();
}
*/

