// input data page two 

var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');
var beforeHData={};


Page({
  data: {
    userInfo: {},
    nickName:'',
    openId:'',
    logged: false,
    takeSession: false,
    requestResult: '',
    weight_toHNum:'',
    weightBeforeHNum:'',
    weightAfterHNum:'',
    weightHNum:'',
    overHNum:'',
    bloodHighPAfterNum: '',
    bloodLowPAfterNum: '',
    heartBitAfterNum: '',
    hDurationNum:'',
    overHWarning:'',
    service: {
      pageTitle: 'Hello World really?',
      weight_toH: 'Weight to H',
      afterWeight: 'Weight After H',
      weightH:'Weight H',
      OverH:'Over H number',
      bloodHighPressureAfter: 'High Blood Pressure',
      bloodLowPressureAfter: 'Low Blood Pressure',
      heartBitAfter: 'Heart Bit Rate',
      userAccount: 'lala',
      inputValue: '',
      weight_lasttime: "Weight of last time",
      weight_lasttimeNum: "",
      beforeWeight: "before Weight (kg)",
      weightToH: "weight to Hm",
      weightToHNum: "20",
      hDuration: 'duration of H',
      saveNext: "Save and Next",
      save: "Save Data",
      canIUse: wx.canIUse('button.open-type.getUserInfo')

    },
    iconSize: [20, 30, 40, 50, 60, 70],
    iconColor: [
          'red', 'green', 'rgb(0,255,255)', 'blue', 'purple'
        ],
    iconType: [
          'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
        ]
  },

  onLoad: function (options) {
    //collect the date of before H
    beforeHData=options;

    //set UI and initial data
    this.setData({
      title: options.title,
      weight_toHNum:options.weightToH,
      weightBeforeHNum:options.weightBeforeH,
      nickName:options.nickName,
      openId:options.openId,
      weightHNum:'',
      weightAfterHNum:'',
      overHNum:'',
      bloodHighPAfterNum: '',
      bloodLowPAfterNum: '',
      heartBitAfterNum: '',
      hDurationNum: '4',
      overHWarning:'',
      service: {
        pageTitle: 'Today is ' + util.formatAll(new Date()),
        weight_toH: 'Weight to H',
        afterWeight: 'New Weight After H',
        weightH:'Weight H',
        OverH:'Over H number',
        bloodHighPressureAfter: 'High Blood Pressure',
        bloodLowPressureAfter: 'Low Blood Pressure',
        heartBitAfter: 'Heart Bit Rate',
        hDuration: 'duration of H',
        hasUserInfo: false,
        userAccount: 'lala',
        inputValue: '',
        saveNext: "Save and Next",
        save: "Save Data",
        canIUse: wx.canIUse('button.open-type.getUserInfo')

      },

    })
  },
  beforeWeightKeyInput: function (option) {
    var newWeight = option.detail.value;
    var cleanWeight = this.data.weightBeforeHNum-newWeight;
    var overWeight=cleanWeight.toFixed(1)-this.data.weight_toHNum;
    var overWeightCheck=(overWeight.toFixed(1)>0.0)? true: false;
    this.setData({
      weightAfterHNum: newWeight,
      weightHNum: cleanWeight.toFixed(1),
      overHNum: overWeight.toFixed(1),
      overHWarning: false

    })
  },
  dataKeyInput: function(e){
        switch(e.target.id)
            {
                case 'bloodPresssureHighA':
                    this.setData({
                      bloodHighPAfterNum:e.detail.value
                    });
                    break;
                case 'bloodPressureLowA':
                    this.setData({
                      bloodLowPAfterNum: e.detail.value
                    });
                    break;
                case 'heartBitA':
                  this.setData({
                    heartBitAfterNum: e.detail.value
                  });
                  break;
            }


  },

  submit: function () {
    //map the data of two phases, before H and after H
    var afterData={
                weightAfterH: this.data.weightAfterHNum,
                overH: this.data.overHNum,
                highPressureAfter: this.data.bloodHighPAfterNum,
                lowPressureAfter: this.data.bloodLowPAfterNum,
                heartBeatRateA: this.data.heartBitAfterNum,
                hDuration:this.data.hDurationNum
         };
    var allData=util.objectMerge( beforeHData, afterData);
    console.log(allData);

    util.showBusy('上传数据请求中...');
    var that = this
    wx.request({
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      url: `${config.service.inputSecondDataUrl}`,
      method: 'post',
      //data: allData,
      data: {
                openId: beforeHData.openId,
                nickName: beforeHData.nickName,
                lastWeight: beforeHData.lastWeight,
                weightBeforeH: beforeHData.weightBeforeH,
                highPressureBefore: beforeHData.highPressureBefore,
                lowPressureBefore: beforeHData.lowPressureBefore,
                heartBeatRateB: beforeHData.heartBeatRateB,
                weightToH: beforeHData.weightToH,
                weightAfterH: this.data.weightAfterHNum,
                overH: this.data.overHNum,
                highPressureAfter: this.data.bloodHighPAfterNum,
                lowPressureAfter: this.data.bloodLowPAfterNum,
                heartBeatRateA: this.data.heartBitAfterNum,
                hDuration: this.data.hDurationNum,
                dateToH : beforeHData.hDate ,
                hospital: beforeHData.hospitalName

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

    util.showBusy('Backto Main Page ...')
    wx.switchTab({
                  url: '../main/main',
                });
  },

  inputTwoSaveNext: function () {
    util.showBusy('Saving...')
    wx.switchTab({
                  url: '../main/main',
                  success(result){
                    this.onLoad();
                  }
                });
  }





})
