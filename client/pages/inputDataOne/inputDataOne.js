// input data page one 

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var services= require('../../utils/services')


Page({
  data: {
    userInfo: {},
    nickName:'',
    openId:'',
    hasUserInfo: false,    
    logged: false,
    takeSession: false,
    requestResult: '',
    saveNextButtonStatus: false,
    hDate:'',
    weight_lasttimeNum: '',
    weightToHNum: '',
    beforeWeightNum: '',
    bloodHighNum:'',
    bloodLowNum:'',
    heartBitNum:'',
    next: "Save and Next",
    nextStatus: false,
    save: "Next",
    saveStatus: true,
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
      canIUse: wx.canIUse('button.open-type.getUserInfo')

    },
  },

  onLoad: function (options) {
    //check the existing records
    console.log(options);
    var that =this;
    wx.request({
          url: `${config.service.host}/weapp/input` +'?openId='+options.openId +'&nextHDate='+options.nextHDate,
          method: 'get',
          login: true,
          success(result) {
            console.log(result);
            util.showSuccess('查询已输入数据完成');
            var param= {};
            if(services.isEmptyObject(result)){
                param.dateToH = options.nextHDate;
                param.lastWeight = options.weight;
                param.weightToH='';
                param.weightBeforeH='';
                param.highPressureBefore='';
                param.lowPressureBefore='';
                param.heartBeatRateB='';
            }else {
                param=result.data[0];
                console.log(param);
            };

            //set initial data
            that.setData({
              title: options.title,
              nickName:options.nickName,
              openId:options.openId,
              hDate: param.dateToH,
              weight_lasttimeNum: param.lastWeight,
              weightToHNum: param.weightToH,
              beforeWeightNum: param.weightBeforeH,
              bloodHighNum: param.highPressureBefore,
              bloodLowNum: param.lowPressureBefore,
              heartBitNum: param.heartBeatRateB,
              next: "Next",
              nextStatus: options.oH == 'N' ? true: false,
              save: options.oH == 'N' ? "Save Data" :"Update Data" ,
              saveStatus: options.oH == 'N' ? false : true,
              service: {
                pageTitle: 'Date is ' + options.nextHDate,//util.formatAll(util.todayDate()),
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
                canIUse: wx.canIUse('button.open-type.getUserInfo')
                        }

                    })
              },
                fail(error) {
                  util.showModel('请求失败', error);
                  console.log('request fail', error);
                }
              });
       

  },

  //calculate the weight to h
  beforeWeightKeyInput: function (option) {
    var newWeight = option.detail.value;
    var cleanWeight = newWeight - this.data.service.weight_lasttimeNum;
    this.setData({
      beforeWeightNum: option.detail.value,
      weightToHNum: cleanWeight.toFixed(1),
      saveStatus: false
    });

  },

  //update date once the inputs changed 
  inputOneSave: function () {
    util.showBusy('请求中...')
    var that = this
    console.log('start request  ' + config.service.inputFirstDataUrl)
    qcloud.request({
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },  
      url: `${config.service.host}/weapp/input`,
      method: 'post',      
      data: {
              nickName:this.data.nickName,
              openId: this.data.openId,
              lastWeight: this.data.weight_lasttimeNum,
              weightBeforeH: this.data.beforeWeightNum,
              weightToH: this.data.weightToHNum,
              highPressBefore: this.data.bloodHighNum,
              lowPressBefore: this.data.bloodLowNum,
              heartBitRateB: this.data.heartBitNum,
              hDate: this.data.hDate,
              hospitalName: ''
            },
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          requestResult: JSON.stringify(result.data),
          nextStatus: false,
          save: 'Update',
          saveStatus: true
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    });


  },

  dataKeyInput: function(e){
    switch(e.target.id)
        {
            case 'bloodHigh':
                this.setData({
                  bloodHighNum : e.detail.value
                });
                break;
            case 'bloodLow': 
                this.setData({
                  bloodLowNum : e.detail.value
                });
                break;
            case 'heartBit':
              this.setData({
                heartBitNum: e.detail.value
              });
              break;
        }
  },
  
  inputOneNext: function(){
    var string= '&weightToH='+this.data.weightToHNum
                +'&hDate='+this.data.hDate
                +'&nickName='+this.data.nickName
                +'&openId='+this.data.openId
                +'&weightBeforeH='+this.data.beforeWeightNum
                +'&lastWeight='+ this.data.weight_lasttimeNum
                +'&highPressureBefore=' +this.data.bloodHighNum
                +'&lowPressureBefore='+ this.data.bloodLowNum
                +'&heartBeatRateB='+ this.data.heartBitNum
                +'&hospitalName='+ '';

    wx.navigateTo({
      url: '../inputDataTwo/inputDataTwo?title=Input Data Two'+string,
    });
    console.log(string);
  },
  nex: function(e){
        wx.switchTab({
              url: '../main/main',
            });
    }



})
