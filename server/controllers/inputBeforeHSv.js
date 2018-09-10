//inputBeforeHSv.js

const { message: { checkSignature } } = require('../qcloud')
var helper = require('../helper/helper.js')
var db=require('../helper/mysqldb.js');

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

  var data=[ctx.request.query.openId, ctx.request.query.nextHDate];
  var sql='select * from tFirstInput where  openId = ? and dateToH= ?  '

  ctx.response.type = 'text/html';
  //ctx.response.type = 'JSON';
  //responce body
  //ctx.body = ctx.request.body;
 
  ctx.body =await getInputBeforeData(sql, data);
}

async function post(ctx, next) {
  // 检查签名，确认是微信发出的请求
  const { signature, timestamp, nonce } = ctx.query
  if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATUREeee'
   
   /**
   * 解析微信发送过来的请求体
   * 可查看微信文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html#接收消息和事件
   */

 /* var data=ctx.request.body;
  var insertResult=await insertData(data);*/
  const body = ctx.request.body;
  ctx.body = ctx.request.body;
  //ctx.body = 'success';


        var date=new Date();
        var dateString=helper.formatTime(date);


          //queryString = 'select * from sample';
          queryString = 'INSERT  INTO tFirstInput SET ? ';
          var results = {
                          "openId": ctx.request.body.openId,
                          "nickName": ctx.request.body.nickName,
                          "lastWeight": ctx.request.body.lastWeight,
                          "weightBeforeH": ctx.request.body.weightBeforeH,
                          "weightToH": ctx.request.body.weightToH,
                          "highPressureBefore": ctx.request.body.highPressBefore,
                          "lowPressureBefore": ctx.request.body.lowPressBefore,
                          "heartBeatRateB": ctx.request.body.heartBeatRateB,
                          "dateToH":ctx.request.body.hDate,
                          "date": dateString,
                          "hospitalName": 'yueyang'
                          }

          //initialize connection
          connection.connect(function (err) {
            if (err) {
              console.error("error connection: ");
              return;
            }
            console.log('connection sueccess! ');
          });
            // insert the data to tHallData table
          connection.query(queryString, results, function (err, res) {
            if (err) {ctx.body=error; throw err;}

            console.log('Last record insert id:');
          });

            //update the data to the tHdata     table  with the status change
            var queryStringUpdate = 'UPDATE tHdata SET NextHDate= ? , onH= ? WHERE openId= ? ';
            var nextData= [
                results.dateToH,
                'Y',
                results.openId
            ];

            connection.query(queryStringUpdate, nextData, function(err, res){
                        if(err) throw err;

                    });
          //close connection
            connection.end(function (err) {
                if (err) {
                  console.log('close connection error -->');
                  throw err
                };
            });

      };

function getInputBeforeData(sql, data) {
    return new Promise ((resolve, reject)=>{
        var results=[];
        var queryString=sql;
        var queryData=data;
        db.query(queryString, queryData, function(res){
            for (var i in res){
                        results.push(res[i]);
                    };
             resolve(results);

        })
    });

}





module.exports = {
  post,
  get
}
