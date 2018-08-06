//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')


App({
    logon_user:'',
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    }
})