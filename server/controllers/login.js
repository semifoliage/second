// 登录授权接口
const config = require('../config') ;
var helper = require('../helper/helper.js')
var db=require('../helper/mysqldb.js');
var https=require('https');

const baseUrl = 'api.weixin.qq.com';
const pathUrl ='/sns/jscode2session?';
const newUserSQL = 'INSERT INTO tAccount SET ?';
const initateNewUserSQL ='insert into tHdata set ?';
const existUserSQL='select * from tAccount where openId= ?';


var options={
  host:  baseUrl,
  port: 443,
  path:  pathUrl,
  method: 'GET',
  headers: {
    'Content-Type': 'text/plain'  //'application/x-www-form-urlencoded'
  }
};
var result='', resultFinal='';



module.exports = async (ctx, next) => {
  var _code = ctx.request.query.code;
  var _appid = config.appId;
  var _secret = config.appSecret;


  options.path +=   'appid=' + _appid + '&secret=' + _secret + '&js_code=' + _code + '&grant_type=authorization_code';
  var urlString='https://'+options.host+options.path;
  var that=this;

  //collect user nickName
  var userNickName=ctx.request.query.nickName;
  
  ctx.response.type='text';
  //ctx.body = await openIdRequest(urlString);

  var userInfo=JSON.parse(await openIdRequest(urlString));
  userInfo.nickName=userNickName;
  var check =await checkUser(userInfo);
  ctx.body = check;//await checkUser(userInfo);//await openIdRequest(urlString);
 
   /* request.get(urlString, function(error, response, body){
            if (!error && response.statusCode == 200) {
                    console.log(response.body) // 请求成功的处理逻辑

                        result.push(response.body );

                }else{
                    result=error;
                }

    });*/

  /*
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)
    }
    */
    //check
  
};
// query the openid and seessionkey from tencent net
  function openIdRequest(url){
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        res.on('data', (chunk) => {
          result += chunk;
          resolve(result);
        });
        res.on('error', (error) => {
          reject(error);
        });
        res.on('end', () => {
          console.log('https.get end');
        });

      });
    });
  };

//check the openId records or not
async function checkUser ( user){


         var userOpenId=user.openid;

          var query = await existUser(existUserSQL, userOpenId);
          var queryJson=JSON.stringify(query);
          var queryStatus='';

        if(queryJson=='[]'){
            console.log('user does not exist, user data and initiate data are created');

            //create new user
            createNewUser(newUserSQL, user);

            //initate user data
            initateNewUserData(initateNewUserSQL, user);

            //copy the info from user to the new object and return
            var newUser=user;
            newUser.role1='1';
            newUser.role2='2';
            newUser.userStatus='0';

            return (newUser);
        }else {
            console.log('user exist ');
            //remove the sessionkey info and add query info
            var newQuery=query[0];
            console.log(newQuery);
            //delete newQuery.sessionkey;
            newQuery.userStatus= '1';

            return(newQuery);
        }




};


// create new user record in table
  function createNewUser(sql, user){

        var data ={
            "openId": user.openid,
            "sessionkey": user.session_key,
            "nickName": user.nickName,
            "lastLogon_date": '',
            "role1":'1',
            "role2": '1'
        };
        db.insert(sql, data, function(res){
            console.log('insert new user to tAccount table')
            return res;
        });


  };

// initiate the data for the new user
  function initateNewUserData(sql, user){

        var todayString=helper.formatDate(new Date());
        var data= {
            "openId": user.openid,
            "nickName": user.nickName,
            "lastWeight": '0',
            "LastHDate": todayString,
            "NextHDate": todayString,
            "onH": 'N'
        };
        db.insert(sql, data, function(res){
            console.log('insert initial data to tHData table')
            return res;
        })


  };

//query exist user data
function existUser(sql, user){
    return new Promise((resolve, reject)=>{
        var data=[];

                  db.query(sql, [user], function(res){
                    for (var i in res){
                        data.push(res[i]);
                    };
                    console.log('check user exist or not-->')
                    //console.log(sql + user);
                    //console.log(data);
                   resolve(data);
                });

    })


}

