//allRecordsSv.js
/*
    this js is to query the user data in table 'tHallData' and exports
*/

var helper = require('../helper/helper.js')
var db=require('../helper/mysqldb.js');

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

  var sql=  'select * from tHallData where openId= ? ' ;
  //var user= ctx.request.body;
  var data=ctx.request.query.openId;
  ctx.response.type = 'text';
  //responce body
  ctx.body = await queryInfo(sql, data);

};

//query data from the db.query module
function queryInfo(sql, user){
    return new Promise((resolve, reject)=>{
       var results=[];
       var queryString=sql;
       var queryData=[user];

       db.query(queryString, queryData, function(res){
               for (var i in res){
                   results.push(res[i]);
               };

               resolve(results);
                   } );
    });

};