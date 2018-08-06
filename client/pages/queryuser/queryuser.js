//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',   
    service: {
      pageTitle: 'Hello World really?',
      userInfo: {},
      hasUserInfo: false,
      userAccount: 'lala',
      inputValue: '',
      weight_lasttime: "Weight of last time",
      weight_lasttimeNum: "66",
      beforeWeight: "before Weight (kg)",
      weightToH: "weight to Hm",
      weightToHNum: "20",
      submit: "submit",
      canIUse: wx.canIUse('button.open-type.getUserInfo')

    },
  },
  
  onLoad: function (options) {
    var date=new Date;
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    this.setData({
      title: options.title,
      pageTitle: 'Today is '+day + '/' + monthIndex + '/' + year,
      weight_lasttimeNum: "67",
    })
  },
  beforeWeightKeyInput: function (option) {
    var newWeight = option.detail.value;
    var cleanWeight = newWeight - this.data.weight_lasttimeNum;
    this.setData({
      weightToHNum: cleanWeight
    })
  },
  submit: function () {
    util.showBusy('请求中...')
    var that = this
    console.log('start request  ' + config.service.host + '/weapp/queryuser')
    qcloud.request({
      url: `${config.service.host}/weapp/queryuser`,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    });
  },

 

})
