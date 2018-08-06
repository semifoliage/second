// 登录授权接口
const config = require('../config') ;
const baseUrl = 'api.weixin.qq.com';
const pathUrl ='/sns/jscode2session?'
var https = require('https');
var url=require('url');

var options={
  host: 'www.sap.com',//baseUrl,
  port: 443,
  path: '/',//pathUrl,
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};
var result='';



module.exports = async (ctx, next) => {
  var _code = ctx.request.query.code;
  var appidCode = config.appId;
  var secretCode = config.appSecret;


   options.path +=   'appid=' + appidCode + '&secret=' + secretCode + '&js_code=' + _code + '&grant_type=authorization_code';
  var urlString='https://'+options.host+options.path;

 var urlLink=url.parse(urlString);
 //request the openid
  var reqs=https.request(urlLink ,  function(res)  {
    res.setEncoding('utf8');
    console.log('res headers : '+JSON.stringify(res.headers));
    //result = JSON.stringify(res.headers);
    res.on('data', (chunk)=>{
                       /*for (i in chunk) {
                           result.push(chunk[i]);
                         };*/
                      //console.log('result is '+chunk)
                      //result.push(chunk)
                      result=chunk.data.openid;
                      return result;
    });
    /*res.on('end', () =>{
    });*/


  })


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
  ctx.response.type = 'JSOON';
  ctx.body =  JSON.stringify(result);//JSON.stringify(reqs);//'this is login controller \r' +urlGetOpenId;
};

function simpleStringify (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};