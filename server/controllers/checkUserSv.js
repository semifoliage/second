//checkUserSv.js
/*
  this controller is check the user openid, nickname are recorded in database or not.  if the info is recorded, return
  the openid,  otherwise, add the new user and return openid
*/
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
  var user={
        openid: ctx.request.query.openid,
        nickname: ctx.request.query.nickname
  };
  var userExist=await getUser(user);

  if(!userExist){
        var adduser= await addUser(user);
  }else{
  };


  ctx.response.type = 'text';
  //responce body
  ctx.body = JSON.stringify(results);

};

function getUser(user){
    return new Promise((resolve, reject)=>{
    var results = [];
    var data=[];
    //data.push(ctx.request.query.userAccount);
    var queryString = 'select * from tHdata where userAccount= ?' ;

    connection.connect(function (err) {
    if (err) {
         console.error("error connection: ");
         return;
         }
         console.log('Demo connection sueccess! ');
        });

    data.push(user);

    connection.query(queryString, data, function (err, rows, fields) {
        if (err) throw err;
        console.log('----------StartInfo select --------');
        console.log(rows);
        iss=rows.length;
        for (i in rows) {
                  results.push(rows[i]);
            };
        });
        resolve(results)
        console.log('-------StartInfo close connection------');
        connection.end();
          ;
    });
};

function addUser(user){
    return new Promise((resolve, reject)=>{
        queryString = 'INSERT  INTO tFirstInput SET ? ';
        var data = {
                          "userAccount": 'sdf',
                          "userNickName":'haha'
                         /* "idRecord": '11',
                          "userAccount": 'ss',
                          "lastWeight": '66',
                          "weightBeforeH": '69',
                          "weightToH": '2',
                          "highPressureBefore": '140',
                          "lowPressureBefore": '90',
                          "heartBeatRateB": '78',
                          "date": Date.now(),
                          "hospitalName": 'yueyang'  */
                          }

          //initialize connection
        connection.connect(function (err) {
            if (err) {
              console.error("error connection: ");
              return;
            }
            console.log('connection sueccess! ');
          });

        connection.query(queryString, data, function (err, res) {
            if (err) throw err;

        console.log('Last record insert id:');
        resolve(res);
        });

          //close connection
        connection.end(function (err) {
            if (err) {
              console.log('close connection error -->');
              throw err
            };
          });
    })
}

//connection.end();
