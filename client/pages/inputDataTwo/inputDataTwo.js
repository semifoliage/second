// input data page two 

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
      weight_lasttimeNum: "",
      beforeWeight: "before Weight (kg)",
      weightToH: "weight to Hm",
      weightToHNum: "20",
      saveNext: "Save and Next",
      save: "Save Data",
      canIUse: wx.canIUse('button.open-type.getUserInfo')

    },
  },

  onLoad: function (options) {
    var date = new Date;
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    //console.log(options.weight);
    this.setData({
      title: options.title,
      service: {
        pageTitle: 'Today is ' + day + '/' + monthIndex + '/' + year,
        userInfo: {},
        hasUserInfo: false,
        userAccount: 'lala',
        inputValue: '',
        weight_lasttime: "Weight of last time",
        weight_lasttimeNum: options.weight,
        beforeWeight: "before Weight (kg)",
        weightToH: "weight to Hm",
        weightToHNum: "20",
        saveNext: "Save and Next",
        save: "Save Data",
        canIUse: wx.canIUse('button.open-type.getUserInfo')

      },

    })
  },
  beforeWeightKeyInput: function (option) {
    var newWeight = option.detail.value;
    var cleanWeight = newWeight - this.data.service.weight_lasttimeNum;
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

  inputOneSave: function () {


  },
  inputTwoSaveNext: function () {
    util.showBusy('Saving...')
    wx.navigateTo({
      url: '../main/main',
    })
  }



})
