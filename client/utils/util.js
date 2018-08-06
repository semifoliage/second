  
  //format date to string
  const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const todayDate =() => {
  return new Date()
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')  

}

const formatAll = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') + '\n'+ formatweek(date)

}

var formatweek= date =>{
  const weekD = date.getDay()
  var weekDate = '4'

  switch (weekD) {
    case 1:
      return 'Mon'
    case 2:
      return 'Tue'
    case 3:
      return 'Wen'
    case 4:
      return 'The'
    case 5:
      return 'Fri'
    case 6:
      return 'Sat'
    case 7:
      return 'Sun'

  }

}

//format string to date
var stringToDate = stDate => {
  var date=new Date(stDate);
  return date
}

//date calculate
var dateCalcul = (date, number) => { 
  var data = new Date(date);
  data.setDate(data.getDate() + parseInt(number) )   
  return formatDate(data)
}
var weekCalcul = (weekday) =>{
  if (weekday == '1'&&'3'&&'5'){
          return [1,3,5]
  }else {
          return [2,4,6]
  }
}


//sample method 
var sample = (data ) =>{
  return weekCalcul(data)
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

module.exports = { formatTime, formatDate, formatAll, showBusy, showSuccess, showModel, dateCalcul, todayDate}
