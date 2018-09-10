//queryList.js
const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var order = ['red', 'yellow', 'blue', 'green', 'red']

Page({
  data: {
    userInfo: {},
    logged: false,
    nickName:'',
    userInfo:'',
    openId:'',
    lastHDate: '2018-08-19',
    takeSession: false,
    requestResult: '',
    imgUrl: '',
    toView: 'red',
    scrollTop: 100,
    records: [],
    err_page_data: null
  },

 onLoad: function (options) {
    this.setData({
          logged: true,
          nickName: app._nickName,
          userInfo: app._userInfo,
          openId: app._openId
    });

    //query all data
    var that = this;
          wx.request({
            url: `${config.service.queryAllDataUrl}`,
            data: {openId:that.data.openId},
            success: function (res) {
              var records = res.data;
              console.log('信息' +records.length);
              records.forEach(function (item) {
                item.isShow = true;
              });
              //update the view
              that.setData({
                    records: records
                    });
              //将书单数据缓存到本地
              wx.setStorage({
                key: 'list',
                data: records,
                success: function (res) {
                  console.log('成功保存所有记录到本地缓存');
                }
              });
            },
            fail: function () {
              //显示网络错误提示页面
              //先获取本地缓存中的书单数据，并提示网络错误，若本地没有缓存数据，显示app状态页
              wx.getStorage({
                key: 'list',
                success: function (res) {
                  console.log('使用本地缓存的数据');
                  if (res.data && res.data[0].factionName) {
                    that.setData({ records: res.data });
                  } else {
                    that.setData({
                      err_page_data: {
                        show: true,
                        image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
                        text: '努力找不到网络>_<请检查后重试',
                        buttonText: '重试',
                        click: 'queryAll'
                      }
                    });
                  }
                },
                fail: function (err) {
                  console.log('获取缓存失败' + err);
                  that.setData({
                    err_page_data: {
                      show: true,
                      image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
                      text: '努力找不到网络>_<请检查后重试',
                      buttonText: '重试',
                      click: 'queryAll'
                    }
                  });
                }
              });
              console.log("请求列表失败");
              that.setData({
                err_page_data: {
                  show: true,
                  image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
                  text: '努力找不到网络>_<请检查后重试',
                  buttonText: '重试',
                  click: 'query'
                }
              });
            },
            complete: function () {
              //请求完成结束loading
              wx.hideToast();
            }
          })


 },

 goToDetail: function(e){
    var currentId = e.currentTarget.dataset.id;
    wx.navigateTo({
          url: '../queryDetail/queryDetail?id=' + currentId
        });

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

  




})




  

