//main.js
var app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
 


Page({
  data: {
    userInfo: {},
    nickName:'',
    openId:'',
    logged: false,
    takeSession: false,
    requestResult: 'suc',
    weight:'',
    lastHDate:'',
    nextHDate:'',
    lastWeight:'',
    onH:'',
    beforeHstatus: false,
    afterHstatus:true,
    service: {
      pageTitle: 'Hello World really?',
      lastHDateText: 'Last H Date: ',
      lastHWeightText: 'Last H Weight: ',
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

  onShow: function (options) {
     
    //collect initial info and update data
    var that = this;
    var lastHDateValue, lastHWeightValue, nextHDateValue;      
    this.setData({
      logged: true,
      userName: app._nickName,
      userInfo: app._userInfo
    });    
    var urlLink = `${config.service.host}/weapp/start`+'?userAccount='+this.data.userName; 
    //console.log('start request  ' + config.service.host + '/weapp/queryuser')  

    //request the data 
    //console.log('main Url=' + `${config.service.host}/weapp/demo`);
    wx.request({
      url:   `${config.service.userHInfoUrl}`,
      login: false,
      data: {user:app._openId},
      success(result) {
        util.showSuccess('请求成功完成')
        console.log(result)        
        that.setData({            
            title: 'Main Page',
            openId: result.data[0].openId,
            nickName: result.data[0].nickName,
            lastHDate: result.data[0].LastHDate,
            nextHDate: result.data[0].NextHDate,
            lastHWeight: result.data[0].lastWeight,
            onH: result.data[0].onH,
            beforeHstatus: result.data[0].onH=='N'? false: true ,
            afterHstatus : result.data[0].onH=='N'? true: false ,
            service: {
              pageTitle: '今天 ' + util.formatAll(util.todayDate())+'\t' ,// + day + '/' + monthIndex + '/' + year,
              lastHDate: result.data[0].LastHDate,
              lastHDateText: 'Last H Date: ',
              lastHWeight: result.data[0].lastWeight,
              lastHWeightText: 'Last H Weight: ',
              nextHDate: result.data[0].NextHDate,
              nextHDateText: "Next H Date: ",
              nextHstartText: "Next H Start? :",
              nextHstart: result.data[0].onH=="Y"? ' START': ' NOT START',
              submit: "submit",
              inputDataOne: result.data[0].onH=="Y" ? ' Update 1s record': ' input 1st record',
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
  /*beforeWeightKeyInput: function (option) {
    var newWeight = option.detail.value;
    //var cleanWeight = newWeight - this.data.weight_lasttimeNum;
    this.setData({
      lastWeightKeyInput: newWeight
    })
  },*/
  submit: function () {
    util.showBusy('请求中...')
    var that = this
    console.log('start request  ' + config.service.host + '/weapp/queryuser')
    qcloud.request({
      url: `${config.service.host}/weapp/queryuser`,
      login: true,
      success(result) {
        console.log(result);
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
    /*this.setData({
      
        beforeHstatus: true
      
    })*/
    var string='?title=Input Data One&weight=' + this.data.lastHWeight
                + '&nextHDate=' + this.data.nextHDate
                +'&nickName='+this.data.nickName
                +'&openId='+this.data.openId
                +'&onH='+this.data.onH;
    wx.navigateTo({
      url: '../inputDataOne/inputDataOne'+string//?title=Input Data One&weight=' + this.data.lastHWeight + '&nextHDate=' + this.data.nextHDate +'&nickName='+this.data.nickName+'&openId='+this.data.openId,
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
  },
  bindDateChange: function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log(e);
    if(e.target.id=='lastHDate'){
      this.setData({
        lastHDate: e.detail.value
      })      
    }else if(e.target.id=='nextHDate'){
      var dateChange='nextHDate';
      this.setData({
        nextHDate: e.detail.value
      }); 
    }    
  },
  lastWeightKeyInput: function(e){
    this.setData({
      lastHWeight: e.detail.value 
    })
  }

});

function reload(that){

     var lastHDateValue, lastHWeightValue, nextHDateValue;
        that.setData({
          logged: true,
          userName: app._nickName,
          userInfo: app._userInfo
        });
        var urlLink = `${config.service.host}/weapp/start`+'?userAccount='+this.data.userName;
        //console.log('start request  ' + config.service.host + '/weapp/queryuser')

        //request the data
        //console.log('main Url=' + `${config.service.host}/weapp/demo`);
        wx.request({
          url:   `${config.service.userHInfoUrl}`,
          login: false,
          data: {user:that.data.nickName},
          success(result) {
            util.showSuccess('请求成功完成')
            console.log(result)
            that.setData({
                title: options.title,
                openId: result.data[0].openId,
                nickName: result.data[0].nickName,
                lastHDate: result.data[0].LastHDate,
                nextHDate: result.data[0].NextHDate,
                lastHWeight: result.data[0].lastWeight,
                onH: result.data[0].onH,
                beforeHstatus: result.data[0].onH=='N'? false: true ,
                afterHstatus : result.data[0].onH=='N'? true: false ,
                service: {
                  pageTitle: '今天 ' + util.formatAll(util.todayDate())+'\t' ,// + day + '/' + monthIndex + '/' + year,
                  lastHDate: result.data[0].LastHDate,
                  lastHDateText: 'Last H Date: ',
                  lastHWeight: result.data[0].lastWeight,
                  lastHWeightText: 'Last H Weight: ',
                  nextHDate: result.data[0].NextHDate,
                  nextHDateText: "Next H Date: ",
                  nextHstartText: "Next H Start? :",
                  nextHstart: result.data[0].onH=="Y"? ' START': ' NOT START',
                  submit: "submit",
                  inputDataOne: result.data[0].onH=="Y" ? ' Update 1s record': ' input 1st record',
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

}


