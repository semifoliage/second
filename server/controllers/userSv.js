//userSv.js
/*
    this controller is to query the user info, such as openid, nickname, the weight of last H,  the date of last H,
    , the data of next H and whether is in H or not
*/
var helper = require('../helper/helper.js')
var db=require('../helper/mysqldb.js');

/*var mysql = require('mysql');
var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Business_1',
      database: 'app1'
    });*/

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
  var user={
        //openid: ctx.request.query.openid,
        nickname: ctx.request.query.user
  }

  ctx.response.type = 'JSON';
  //responce body
  ctx.response.body = await userRecord(ctx.request.query.user);
};


function userRecord(user){

    return new Promise ((resolve, reject)=>{
    var queryString = 'select * from tHdata where openId= ?' ;
    var data=user;
    var results = [];

    db.query(queryString, [user], function(res){
                for (var i in res){
                    results.push(res[i]);
                };
                resolve(results);
            } );

   /* //initialize connection
    connection.connect(function (err) {
      if (err) {
        console.error("error connection: ");
        return;
      }
      console.log('Demo connection sueccess! ');
    });
    //queryString = 'select * from uAccount';

    connection.query(queryString, [user], function (err, rows, fields) {
      if (err) { reject (err); throw err;}
      console.log('----------Demo select --------');
      console.log(rows);

      for (i in rows) {
        results.push(rows[i]);
      };

    resolve(results);
    });

    console.log('-------get to page------');
    connection.end();*/
    });

   }




