//queryDetail.js
/*
    this file is to make the detail info
*/

const app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var order = ['red', 'yellow', 'blue', 'green', 'red']

Page({
  data: {
    title: 'Detail Page',
    userInfo: {},
    logged: false,
    nickName:'',
    userInfo:'',
    openId:'',
    records: null,
    selectedRecord: null,
    isInList: 0,
    takeSession: false,
    requestResult: '',
    imgUrl: '',
    toView: 'red',
    scrollTop: 100,
    records: [],
    err_page_data: null
  },
  onLoad: function(options){
    var that =this;
    // show loading
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 0
        });
    //check whether in list
    if (options.isInList === '0' || options.isInList === '1') {
          self.setData({isInList: parseInt(options.isInList)});
        }else{
          var records = wx.getStorageSync('list');
          var isInMyRecord = records.some(function(item){
            return item.idRecord === options.id;
          });
          that.setData({
                isInList: isInMyRecord? 1: 0,
                selectedRecord : records[options.id]
                });

        }

  },
    nex: function(){
      var string='?title=Main Page'
                    +'&nickName='+this.data.nickName
                    +'&openId='+this.data.openId ;
      wx.switchTab({
                        url: '../main/main?'+string

                      });
    }



  })