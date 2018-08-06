//chess.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js');

var timer=null;
var i=0;
var  map=[];
for(var j=0;j<14;j++)
{
	map[j]=[];
}



Page({
    data: {
        requestResult: '',
        canIUseClipboard: wx.canIUse('setClipboardData')
    },
    canvasIdErrorCallback: function (e) {
        console.error
    },

    onReady: function (e) {
        // 使用 wx.createContext 获取绘图上下文 context
        var context = wx.createCanvasContext('firstCanvas')
        var xRight=280;
        var yBottom=280;
        var lineInterval=20;

        context.setStrokeStyle("#000000")
        context.setLineWidth(5)
        context.rect(0, 0, xRight, yBottom)
        context.setLineWidth(2)
        for (var i=20; i<xRight; i=i+20){
            context.moveTo(i , 0)
            context.lineTo(i , yBottom)
        }
        for (var j=20; j<yBottom; j=j+20){
                    context.moveTo(0, j )
                    context.lineTo(xRight, j  )
                }

        context.stroke()
        /*
        context.setStrokeStyle("#ff0000")
        context.setLineWidth(2)
        context.moveTo(160, 100)
        context.arc(100, 100, 60, 0, 2 * Math.PI, true)
        context.moveTo(140, 100)
        context.arc(100, 100, 40, 0, Math.PI, false)
        context.moveTo(85, 80)
        context.arc(80, 80, 5, 0, 2 * Math.PI, true)
        context.moveTo(125, 80)
        context.arc(120, 80, 5, 0, 2 * Math.PI, true)
        context.stroke()
        */


        context.draw()
      },



})


