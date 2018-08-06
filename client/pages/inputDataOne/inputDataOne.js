// input data page one 

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,    
    logged: false,
    takeSession: false,
    requestResult: '',
    saveNextButtonStatus: false,
    service: {
      pageTitle: 'Hello World really?',
      systemDate: '',
      userAccount: 'lala',
      inputValue: '',
      weight_lasttime: "Weight of last time",
      weight_lasttimeNum: "",
      beforeWeight: "before Weight (kg)",
      beforeWeightNum: '',
      weightToH: "weight to Hm",
      weightToHNum: "20",
      bloodHigh: 'Blood High Press',
      bloodHighNum:'',
      bloodLow:'Blood Low Press',
      bloodLowNum:'',
      heartBit: 'Heart Bit Number',
      heartBitNum:'',
      saveNext: "Save and Next",      
      save: "Save Data",
      canIUse: wx.canIUse('button.open-type.getUserInfo')

    },
  },

  onLoad: function (options) {
     
    //console.log(options.weight);
    this.setData({
      title: options.title,
      service: {
        pageTitle: 'Today is ' + util.formatAll(util.todayDate()),
        systemDate: util.formatAll(util.todayDate()),
        userAccount: 'lala',
        inputValue: '',
        weight_lasttime: "Weight of last time",
        weight_lasttimeNum: options.weight,
        beforeWeight: "before Weight (kg)",
        weightToH: "weight to Hm",
        weightToHNum: "20",
        bloodHigh: 'Blood High Press',
        bloodHighNum: '140',
        bloodLow: 'Blood Low Press',
        bloodLowNum: '90',
        heartBit: 'Heart Bit Number',
        heartBitNum: '70',
        saveNext: "Save and Next",
        save: "Save Data",
        canIUse: wx.canIUse('button.open-type.getUserInfo')

      },
       
    })
  },

  //calculate the weight to h
  beforeWeightKeyInput: function (option) {
    var newWeight = option.detail.value;
    var cleanWeight = newWeight - this.data.service.weight_lasttimeNum;
    this.setData({
      beforeWeightNum: option.detail.value,
      weightToHNum: cleanWeight
    });
    this.setDate({
      saveNextButtonStatus: true
    });
  },

  //update date once the inputs changed 
  inputOneSave: function(option){
     
  },

  inputOneSave: function () {
    util.showBusy('请求中...')
    var that = this
    console.log('start request  ' + config.service.host + '/weapp/input')
    qcloud.request({
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },  
      url: `${config.service.host}/weapp/input`,
      method: 'post',      
      data: {
              idRecord: '1',
              userAccount:'admin',
              lastWeight: this.data.service.weight_lasttimeNum,
              weightBeforeH: this.data.service.beforeWeightNum,
              weightToH: this.data.service.weightToH,
              highPressBefore: this.data.service.bloodHighNum,
              lowPressBefore: this.data.service.bloodLowNum,
              heartBitRateB: this.data.service.heartBitNum,
              date:'',
              hospitalName: ''
            },
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

  inputOneSaveNexts: function(){


  },
  inputOneSaveNext: function(){
    wx.navigateTo({
      url: '../inputDataTwo/inputDataTwo?title=Input Data Two',
    })
  }



})
