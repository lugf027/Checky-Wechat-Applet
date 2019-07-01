//index.js 
//获取应用实例 
const app = getApp()

Page({
  data: {
    
    motto: 'Checky, check everyday!',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 事件处理函数
  // 向后台发送用户信息
  sendInfo: function () {
    wx.switchTab({
      url: '../tab/tasks/tasks'
    })
    console.log("准备发送的数据：")
    console.log(app.globalData)
    // 向后台发送
    wx.request({
      url: app.globalData.base+":"+app.globalData.port+ '/wechat/login',
      method: 'POST',
      data: {
        "code": app.globalData.code,
        "userInfo": app.globalData.userInfo,
        "location": app.globalData.location
      },
      success: (res) => {
        console.log(res.data)
        app.globalData.openId=res.data.states
        if (app.globalData.openId!="0"){
          wx.showModal({
            title: '提示',
            content: '登录失败,请重试',
            showCancel: false,
            success(res) {
              if (res.confirm) {
              }
            }
          })
        }
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("已有信息")
      // this.sendInfo()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 
      // 所以此处加入 callback 以防止这种情况 
      console.log("已授权，无信息")
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      // this.sendInfo()
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理 
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log("点击授权")
    // this.sendInfo()
  }
}) 