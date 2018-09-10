//services.js
/*
    this file is to provide the services to client, such as network checking
*/


var networkStatus =()=>{
    wx.request({
        url:   `${config.service.requestUrl}`,
        login: false,
        success(result) {

        },
        fail(err){

        }
    })

};


var isEmptyObject= (obj)=>{

     if(JSON.stringify(obj.data)==="[]") return true;   //false ,  is empty
     return false;  //true , is not empty

};

var userInfoStorage=(obj)=>{
    wx.setStorage({
                    key: 'user',
                    data: obj,
                    success: function (res) {
                      console.log('successfully story user ');
                      console.log(res);
                    }
                  });
};


module.exports = { isEmptyObject, userInfoStorage};