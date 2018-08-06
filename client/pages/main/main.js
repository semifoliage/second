//main.js
var app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
 


Page({
  data: {
    userInfo: { lastLoginTime: 'sss'},
    userName:'',
    logged: false,
    takeSession: false,
    requestResult: 'suc',
    weight:'',
    service: {
      pageTitle: 'Hello World really?',
      lastHDate: '111 ',
      lastHDateText: 'Last H Date: ',
      lastHWeight: '2222 ',
      lastHWeightText: 'Last H Weight: ',
      nextHDate: "33333 ",
      nextHDateText: "Next H Date: ",
      nextHstartText: "Next H Start?",
      nextHstart: "",
      submit: "submit",
      inputDataOne: "input 1st record",
      beforeHstatus: false,
      inputDataTwo: "input 2st record",
      afterHstatus:true,
      queryData: "query previous last records" ,         
      canIUse: wx.canIUse('button.open-type.getUserInfo')

    },
  },

  onLoad: function (options) { 
     
    //collect initial info and update data
    var that = this;
    var lastHDateValue, lastHWeightValue, nextHDateValue;      
    this.setData({
      userName: app.logon_user
    });    
    var urlLink = `${config.service.host}/weapp/start`+'?userAccount='+this.data.userName; 
    //console.log('start request  ' + config.service.host + '/weapp/queryuser')  

    //request the data 
    //console.log('main Url=' + `${config.service.host}/weapp/demo`);
    qcloud.request({
      url:   `${config.service.host}/weapp/start`,
      login: false,
      data: {userAccount:this.data.userName}, 
      success(result) {
        util.showSuccess('请求成功完成')
        console.log(result)        
        that.setData({            
            title: options.title,
            service: {
              pageTitle: 'Today is ' + util.formatAll(util.todayDate())+'\t' ,// + day + '/' + monthIndex + '/' + year,
              lastHDate: result.data[0].LastHDate,
              lastHDateText: 'Last H Date: ',
              lastHWeight: result.data[0].lastWeight,
              lastHWeightText: 'Last H Weight: ',
              nextHDate: result.data[0].NextHDate,
              nextHDateText: "Next H Date: ",
              nextHstartText: "Next H Start? :",
              nextHstart: result.data[0].onH=="Y"? ' START': ' NOT START',
              submit: "submit",
              inputDataOne: "input 1st record",
              beforeHstatus: result.data[0].onH == 'Y' ,
              inputDataTwo: "input 2st record",
              queryData: "query previous last records",
              listAllData: "list all old data",
              onH: result.data[0].onH,

          }   
          

        });
         
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    });
    
    //set date
    //var date = new Date;
    //var day = date.getDate();
    //var monthIndex = date.getMonth();
    //var year = date.getFullYear();
/*
    this.setData({
      title: options.title,
      service: {
        pageTitle: 'Today is ' + + util.formatDate(util.todayDate()),// day + '/' + monthIndex + '/' + year,
      lastHDate: lastHDateValue,
      lastHDateText: 'Last H Date: ',
      lastHWeight: lastHWeightValue,
      lastHWeightText: 'Last H Weight: ',
      nextHDate: nextHDateValue,
      nextHDateText: "Next H Date: ",
      userAccount: 'lala',
      submit: "submit",
      inputData: "input record",
      queryData: "query previous last records",
      listAllData: "list all old data" 
       
      }
    });*/

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

  inputData1stButton: function(){ 
    //console.log('st:' + weight_todelete);
    this.setData({
      
        beforeHstatus: true
      
    })
    wx.navigateTo({
      url: '../inputDataOne/inputDataOne?title=Input Data One&weight=' + this.data.service.lastHWeight,
    })
  },

  inputData2ndButton: function () {
    //console.log('st:' + weight_todelete);
    wx.navigateTo({
      url: '../inputDataTwo/inputDataTwo?title=Input Data Two&weight=' + this.data.service.lastHWeight,
    })
  },

  queryListButton: function(options){
    wx.navigateTo({
      url: '../queryList/queryList?title=List All Data&weight=' + this.data.service.lastHWeight,
    })
  },
  chessAction : function(options){
    wx.navigateTo({
        url: '../chess/chess'
    })
  }

})
