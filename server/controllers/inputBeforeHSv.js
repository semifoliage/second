//inputBeforeHSv.js

const { message: { checkSignature } } = require('../qcloud')

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Business_1',
  database: 'app1'
});



/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get(ctx, next) {
   
  //const { signature, timestamp, nonce, echostr } = ctx.query
  // if (checkSignature(signature, timestamp, nonce)) ctx.body = echostr
  //else ctx.body = 'ERR_WHEN_CHECK_SIGNATUREdddd'
  
  ctx.response.type = 'text/html';
  //ctx.response.type = 'JSON';
  //responce body
  //ctx.body = ctx.request.body;
 
  ctx.body = ctx.request.body;
}

async function post(ctx, next) {
  // 检查签名，确认是微信发出的请求
  const { signature, timestamp, nonce } = ctx.query
  if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATUREeee'
   
   /**
   * 解析微信发送过来的请求体
   * 可查看微信文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html#接收消息和事件
   */
  const body = ctx.request.body
  ctx.body = ctx.request.body;
  //ctx.body = 'success';


  //queryString = 'select * from sample';
  queryString = 'INSERT  INTO tFirstInput SET ? ';
  var results = {
                  "userAccount": 'sdf'
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

  connection.query(queryString, results, function (err, res) {
    if (err) throw err;
     
    console.log('Last record insert id:');
  });

  //close connection
  connection.end(function (err) {
    if (err) {
      console.log('close connection error -->');
      throw err
    };
  });

}

module.exports = {
  post,
  get
}
