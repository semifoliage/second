const app = getApp()
var utils = require('./utils');
var constants = require('./constants');
var Session = require('./session');
var conf = require('../../../config');

var urlLink = conf.service.loginUrl;
//console.log(urlLink)


/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
    function LoginError(type, message) {
        Error.call(this, message);
        this.type = type;
        this.message = message;
    }

    LoginError.prototype = new Error();
    LoginError.prototype.constructor = LoginError;

    return LoginError;
})();

/**
 * 微信登录，获取 code 和 encryptData
 */
var getWxLoginResult = function getLoginCode(data, callback) {
    wx.login({
        success: function (loginResult) {

          /*
            wx.getUserInfo({
                success: function (userResult) {
                    callback(null, {
                        code: loginResult.code,
                        encryptedData: userResult.encryptedData,
                        iv: userResult.iv,
                        userInfo: userResult.userInfo,
                    });
                },

                fail: function (userError) {
                    var error = new LoginError(constants.ERR_WX_GET_USER_INFO, '获取微信用户信息失败，请检查网络状态1');
                    error.detail = userError;
                    callback(error, null);
                },
            });
        },
        */
         
          //console.log('code---');
          // console.log(loginResult)
          if (loginResult.code) {
              //发起网络请求
              wx.request({
                url: urlLink, //'https://test.com/Login',
                data: {
                  code: loginResult.code,
                  nickName: data
                },
                success: function (res) {
                  // 登录成功
                  if (res.statusCode === 200) {
                    console.log(res.data.sessionId)// 服务器回包内容
                  };
                  //collect results
                  console.log('login result');
                  console.log(res.data);
                  var resultString=res.data;
                  console.log(typeof(resultString));
                  if (typeof(resultString)=='string'){
                      var result=resultString.split('}');
                      var resultObj = JSON.parse(result[0] + '}');
                  }else if(typeof(resultString)=='object') {
                      var resultObj=resultString;
                  }

                  Session.set(resultString.session_key);
                  //set app global data
                  //app._openId=resultString.openid;
                  //app._nickName=resultString.nickName;
                  //add to callback
                  callback(null, {
                    openid: resultString.openid,
                    session_key: resultString.session_key
                  });

                  return resultString;
                },
                fail: function(err){
                  console.log(url + ' error ' + err.errMsg)
                }
              })
            } else {
            console.log('登录失败！' + loginResult.errMsg)
            }
          },
           

        fail: function (loginError) {
            var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
            error.detail = loginError;
            callback(error, null);
        },
    });
};

var noop = function noop() {};
var defaultOptions = {
    method: 'GET',
    success: noop,
    fail: noop,
    loginUrl: null,
};

/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {Function} options.success(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
    

    options = utils.extend({}, defaultOptions, options);

    if (!defaultOptions.loginUrl) {
        options.fail(new LoginError(constants.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'));
        return;
    }
    console.log(options.data);
    var doLogin = () => getWxLoginResult(options.data.nickName, function (wxLoginError, wxLoginResult) {
        if (wxLoginError) {
            options.fail(wxLoginError);
            return;
        }
      
        
        var _openid = wxLoginResult.openid;
        var _sessionkey=wxLoginResult.session_key;
        options.success(wxLoginResult.openid);



        /*
        // 构造请求头，包含 code、encryptedData 和 iv
        var code = wxLoginResult.code;
        var encryptedData = wxLoginResult.encryptedData;
        var iv = wxLoginResult.iv;
        var header = {};

        
        header[constants.WX_HEADER_CODE] = code;
        header[constants.WX_HEADER_ENCRYPTED_DATA] = encryptedData;
        header[constants.WX_HEADER_IV] = iv;
      console.log('login.dologin.wxLoginResult.callFunciton options')
      console.log(options.data)
        // 请求服务器登录地址，获得会话信息
        wx.request({
            url: options.loginUrl,
            header: header,
            method: options.method,
            data: options.data,
            success: function (result) {
                var data = result.data;
                console.log('login wx request success result')
                console.log(result.data)
                // 成功地响应会话信息
                if (data && data.code === 0 && data.data.skey) {
                    var res = data.data
                    if (res.userinfo) {                        
                        Session.set(res.skey);
                        options.success(userInfo);
                    } else {
                        var errorMessage = '登录失败(' + data.error + ')：' + (data.message || '未知错误');
                        var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
                        options.fail(noSessionError);
                    }

                // 没有正确响应会话信息
                } else {
                    console.log('login wx request result data empty')
                    var noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, JSON.stringify(data));
                    options.fail(noSessionError);
                }
            },

            // 响应错误
            fail: function (loginResponseError) {
                var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
                options.fail(error);
            },
        });
        */

    });
    //console.log(doLogin());

    var session = Session.get();
    if (session) {
        wx.checkSession({
            success: function () {
                options.success(session.userInfo);
            },

            fail: function () {
                Session.clear();
                doLogin();
            },
        });
    } else {
        doLogin();
        console.log('after check session')
        
    }
};

var setLoginUrl = function (loginUrl) {
    defaultOptions.loginUrl = loginUrl;
};

module.exports = {
    LoginError: LoginError,
    login: login,
    setLoginUrl: setLoginUrl,
};