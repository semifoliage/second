//helper.js
 

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('.') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

var formatDate = date => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month<10) month='0'+month;
    var day = date.getDate();
    if(date<10) date='0'+date;

    return [year, month, day].map(formatNumber).join('-') // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


var newHdateCalculate = dateString =>{
    var newDate= new Date(dateString);
    var day= newDate.getDay();
    var nextDate='';
    if (day== '1' || day ==2 || day == 3 || day == 4 || day== 0){
        nextDate = addDaysToDate(dateString, 2);
    }else if(day == 5 || day == 6 ){
        nextDate =  addDaysToDate(dateString, 3);
    };
    return nextDate;

}

var addDaysToDate=(dateString, days)=>{
    var newDate=new Date(dateString);
    newDate=newDate.valueOf();
    newDate=newDate+days*24*60*60*1000;
    var date=new Date(newDate);
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    if(month<10) month='0'+month;
    var date=date.getDate();
    if(date<10) date='0'+date;

    return year+'-'+month+'-'+date;

}


var arraySort =(array) =>{
    var newArray=[];
    for (var i=0; i<=array.length-1; i++ ){
        for (var j=0; j<array.length-1-i; j++){

        }

    }
}

module.exports = { formatNumber, formatTime, newHdateCalculate, formatDate}
