//index.js
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var todayDate = new Date()

Page({
  data: {
    userInfo: {},
    userDBinfo:{},
    hasUserInfo: false,
    logged: false,
    openId:'',
    takeSession: false,
    requestResult: '',
    noNetwork: false,
    imgUrl: '',
    dateToday: util.formatAll(todayDate)//util.dateCalcul(todayDate, 2)//datecalcul(todayDate, 0)
  },

onLoad: function(options){
    wx.hideTabBar();
    var that =this;

    //get stored info
    wx.getStorage({
          key: 'userRecords',
          success: function (res) {
            console.log(res);
            that.setData({
                openId: res.data.openId,
                userInfo: res.data,
                logged: true
                });
            app._userInfo=res.data;
            app._openId=res.data.openId;
            wx.showTabBar();
             },
           fail: function(err){
             console.log('storage userInfo can not be reload.  login is needed. ');
             util.showBusy('login is required');
             loginFu();
           }
          });
},


  // 用户登录示例
  loginssss: function () {
    if (this.data.logged) return
    util.showBusy('正在登录')
    var that = this;

    //get UserInfo
   wx.getUserInfo({
                success: function(res) {
                  that.setData({
                    userInfo: res

                  });

                    console.log('collect UserInfo');
                    console.log(res);

                    // 调用登录接口
                    qcloud.login({
                      success(result) {
                        console.log('qcloud.login success ');
                        if (result) {
                          util.showSuccess('登录成功')
                          that.setData({
                            openId: result.openid,
                            logged: true
                          });
                          //show the tabbar
                          wx.showTabBar();
                          var userRecord={
                            openId: this.data.openId,
                            nickName: this.data.userInfo.nickName
                          };
                          var checkUserRecord=checkUser(userRecord);

                        } else {
                          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                            console.log('already logon and query the user record');
                            qcloud.request({
                            //qcloud.login({
                            url: config.service.queryuserUrl,
                            data: {
                                    name: res.userInfo.nickName
                            },
                            login: true,
                            success(result) {
                              util.showSuccess('再登录成功')
                              //collect data
                              app._openId=result.data[0].openId;
                              that.setData({
                                openId: result.data[0].openId
                              })
                              console.log('------>second login and request the user info' );
                              //show the tabBar
                              wx.showTabBar();
                              if(!result){
                                  that.setData({
                                    openId: result.data[0].openId,
                                    logged: true
                                  })
                                  app._openid=that.data.openid;  console.log('app._openId'+app._openid);
                              }

                            },

                            fail(error) {
                              util.showModel('请求失败', error)
                              console.log('request fail', error)
                            }
                          })
                        }
                      },

                      fail(error) {
                        util.showModel('登录失败', error)
                        console.log('index 登录失败', error)
                      }
                    })

      }
     });

  },
  getUserInfo_useless: function(e){
        app._nickName = e.detail.userInfo.nickName;
        app._userInfo = e.detail.userInfo;
        var that=this;
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true,
          logged: true
        });
        app._nickName= e.detail.userInfo.nickName;
        console.log('index getUserInfo e.detail  collected ');

        //if (this.data.logged) return

        util.showBusy('正在登录')

        const session = qcloud.Session.get()

        if (session) {
            // 第二次登录
            // 或者本地已经有登录态
            // 可使用本函数更新登录态
            qcloud.request({
                url: config.service.queryuserUrl,
                data: {
                        name: that.data.userInfo.nickName
                },
                login: true,
                success: result => {

                  util.showSuccess('再登录成功')
                  //collect data
                  app._openId=result.data[0].openId;
                  this.setData({
                    openId: result.data[0].openId
                  })
                  console.log('------>second login and request the user info' );
                  //show the tabBar
                  wx.showTabBar();
                  if(!result){
                      this.setData({
                        openId: result.data[0].openId,
                        logged: true
                      })
                      app._openid=that.data.openid;  console.log('app._openId'+app._openid);
                  };
                  //set UserInfo storage
                  this.data.userInfo.openId=result.data[0].openId;
                  wx.setStorage({
                            key: 'userRecords',
                            data: this.data.userInfo,
                            success: function (res) {
                              console.log('successfully story user info');
                              console.log(result.data[0]);
                            }
                          });
                },
                fail: err => {
                    console.error(err)
                    util.showModel('登录错误', err.message)
                }
            })
        } else {
            // 首次登录
            qcloud.login({
                data: {nickName: this.data.userInfo.nickName},
                success: result => {
                    this.setData({ userDBinfo: result, logged: true });
                    app._openId=res.openId;
                    util.showSuccess('登录成功');
                    hat.setData({
                                      openId: result.openid,
                                      logged: true
                                      });
                      console.log(result.openid);
                                   //show tabbar
                      wx.showTabBar();
                },
                fail: err => {
                    console.error(err)
                    util.showModel('登录错误', err.message)
                }
            })
        }

  },

  getUserInfo: function (e) {

      app._nickName = e.detail.userInfo.nickName;
      app._userInfo = e.detail.userInfo;
      var that=this;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        logged: true
      });
      console.log('index getUserInfo e.detail  collected ');

      //set tabbar shown
      if(e.data==[]) {
        util.showSuccess('登录失败');
        return;
      }else{
         ;
      };

      loginFu(that);
  },



  //log info
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //checkUser function. check user openid and nickName are recorded.  if not, create record 

  checkUser: function(user){
    if(user&&user.openId==''&&user.nickName==''){
      util.showSuccess('userInfo is empty')
      return 'userInfo is empty';
    }else{
      //query openId is recorded or not
      qcloud.request({
        url: `${config.service.host}/weapp/demo`,
        login: false,
        data: { openid: user.openId,
                nickname:user.nickName },
        method: 'post', 
        success(result) {
          util.showSuccess('get userinfo请求成功完成')
          console.log(result)
          that.setData({
            title: options.title     


          });

        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      });

    }

  },

  // 切换是否带有登录态
  switchRequestMode: function (e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function () {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },

  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function (e) {
            util.showModel('上传图片失败')
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  // 切换信道的按钮
  switchChange: function (e) {
    var checked = e.detail.value

    if (checked) {
      this.openTunnel()
    } else {
      this.closeTunnel()
    }
  },

  openTunnel: function () {
    util.showBusy('信道连接中...')
    // 创建信道，需要给定后台服务地址
    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

    // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
    tunnel.on('connect', () => {
      util.showSuccess('信道已连接')
      console.log('WebSocket 信道已连接')
      this.setData({ tunnelStatus: 'connected' })
    })

    tunnel.on('close', () => {
      util.showSuccess('信道已断开')
      console.log('WebSocket 信道已断开')
      this.setData({ tunnelStatus: 'closed' })
    })

    tunnel.on('reconnecting', () => {
      console.log('WebSocket 信道正在重连...')
      util.showBusy('正在重连')
    })

    tunnel.on('reconnect', () => {
      console.log('WebSocket 信道重连成功')
      util.showSuccess('重连成功')
    })

    tunnel.on('error', error => {
      util.showModel('信道发生错误', error)
      console.error('信道发生错误：', error)
    })

    // 监听自定义消息（服务器进行推送）
    tunnel.on('speak', speak => {
      util.showModel('信道消息', speak)
      console.log('收到说话消息：', speak)
    })

    // 打开信道
    tunnel.open()

    this.setData({ tunnelStatus: 'connecting' })
  },

  /**
   * 点击「发送消息」按钮，测试使用信道发送消息
   */
  sendMessage() {
    if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
    // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
    if (this.tunnel && this.tunnel.isActive()) {
      // 使用信道给服务器推送「speak」消息
      this.tunnel.emit('speak', {
        'word': 'I say something at ' + new Date(),
      });
    }
  },

  /**
   * 点击「关闭信道」按钮，关闭已经打开的信道
   */
  closeTunnel() {
    if (this.tunnel) {
      this.tunnel.close();
    }
    util.showBusy('信道连接中...')
    this.setData({ tunnelStatus: 'closed' })
  },

  cla(){
    util.showBusy('ss');
     wx.getUserInfo({
                success: function(res) {
                  console.log(res.userInfo)
                }
              })
  }
});

function loginFu( that){
    // 调用登录接口
        console.log('start login');

        qcloud.login({
          data: {nickName: that.data.userInfo.nickName},
          success(result) {
            console.log('qcloud.login success ');
            console.log(result);
            if (result) {
              util.showSuccess('登录成功')
              that.setData({
                              openId: result.openid,
                              logged: true
                              });
               //data update
              console.log('storage the user info and openId');
              app._openId=result.openid;
              var newData=that.data.userInfo;
              newData.openId= result.openid;
              var dataMerged=Object.assign({}, newData, that.data.userInfo);
              wx.setStorage({
                              key: 'userRecords',
                              data: dataMerged,
                              success: function (res) {
                                console.log('successfully story user info');
                                //console.log(result.data[0]);
                              }
                            });
              //show tabbar
              wx.showTabBar();

            } else {
              // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                console.log('already logon and query the user record');
                qcloud.request({
                //qcloud.login({
                url: config.service.queryuserUrl,
                data: {
                        name: that.data.userInfo.nickName
                },
                login: true,
                success(result) {
                  util.showSuccess('再登录成功')
                  //collect data
                  app._openId=result.data[0].openId;
                  that.setData({
                    openId: result.data[0].openId
                  })
                  console.log('------>second login and request the user info' );
                  //show the tabBar
                  wx.showTabBar();
                  if(!result){
                      that.setData({
                        openId: result.data[0].openId,
                        logged: true
                      })
                      app._openid=that.data.openid;  console.log('app._openId'+app._openid);
                  };
                  //set UserInfo storage
                  that.data.userInfo.openId=result.data[0].openId;
                  wx.setStorage({
                            key: 'userRecords',
                            data: that.data.userInfo,
                            success: function (res) {
                              console.log('successfully story user info');
                              console.log(result.data[0]);
                            }
                          });

                },

                fail(error) {
                  util.showModel('请求失败', error)
                  console.log('request fail', error)
                }
              })
            }
          },

          fail(error) {
            util.showModel('登录失败', error)
            console.log('index 登录失败', error)
          }
        })



}


