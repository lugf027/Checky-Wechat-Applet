// pages/tab/essay/essay.js
const app = getApp()
var util = require("../../../utils/util.js")
Page({
  data: {
    path: "",
    height: 0,
    cPage: 1,
    infomation: "正在加载",
    likeNum: 0,
    commentNum: 0,
    essays: [],
    recordTypeNow: "video",
  },
  onLoad: function() {
    var that = this;
    this.setData({
      path: app.getAbsolutePath() + '/',
    })
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          height: res.windowHeight
        })
        that.refreshEssayList()
      },
    })
  },
  onShow: function() {

  },
  // 刷新列表
  refreshEssayList: function() {
    var that = this
    req = {
      url: '/essay/displayEssay',
      method: 'POST',
      data: {
        "userId": app.globalData.openId,
        "cPage": 1
      },
      success(res) {
        console.log(res.data)
        if (res.data.length < 5) {
          that.setData({
            infomation: "nomore",
            essays: res.data,
            cPage: that.data.cPage + 1
          })
        } else {
          that.setData({
            infomation: "loading",
            essays: res.data,
            cPage: that.data.cPage + 1
          })
        }
      }
    }
    if (app.globalData.openId != "") {
      app.requestWithAuth(req)
        .then(req.success)
        .catch(req.fail)
    } else {
      app.requestWithoutAuth(req)
        .then(req.success)
        .catch(req.fail)
    }

  },
  //获取动态列表
  requestEssayList: function() {
    var that = this
    req = {
      url: '/essay/displayEssay',
      method: 'POST',
      data: {
        "userId": app.globalData.openId,
        "cPage": that.data.cPage
      },
      success(res) {
        console.log(res.data)
        if (res.data.length == 0) {
          that.setData({
            infomation: "nomore"
          })
        } else {
          that.setData({
            infomation: "loading",
            essays: that.data.essays.concat(res.data),
            cPage: that.data.cPage + 1
          })
        }
      }
    }
    app.requestWithAuth(req)
      .then(req.success)
      .catch(req.fail)
  },

  //记录点赞情况
  isLike: function(e) {
    if (app.globalData.openId === "") {
      wx.navigateTo({
        url: '../../index/index'
      })
    } else {
      var index = e.target.dataset.index
      console.log(index)
      if (this.data.essays[index].like) {
        req = {
          url: '/essay/unlike',
          method: 'POST',
          data: {
            "essayId": this.data.essays[index].essay.essayId,
            "userId": app.globalData.openId
          },
          success: (res) => {
            console.log(res)
            var statement1 = "essays[" + index + "].like"
            var statement2 = "essays[" + index + "].essay.likeNum"
            this.setData({
              [statement1]: !this.data.essays[index].like,
              [statement2]: this.data.essays[index].like ? this.data.essays[index].essay.likeNum - 1 : this.data.essays[index].essay.likeNum + 1
            })
          },
          fail: (err) => {
            console.log(err)
          }
        }
        app.requestWithAuth(req)
          .then(req.success)
          .catch(req.fail)
      } else {
        req = {
          url: '/essay/like',
          method: 'POST',
          data: {
            "essayId": this.data.essays[index].essay.essayId,
            "userId": app.globalData.openId
          },
          success: (res) => {
            console.log(res)
            var statement1 = "essays[" + index + "].like"
            var statement2 = "essays[" + index + "].essay.likeNum"
            this.setData({
              [statement1]: !this.data.essays[index].like,
              [statement2]: this.data.essays[index].like ? this.data.essays[index].essay.likeNum - 1 : this.data.essays[index].essay.likeNum + 1
            })
          },
          fail: (err) => {
            console.log(err)
          }
        }
        app.requestWithAuth(req)
          .then(req.success)
          .catch(req.fail)
      }
    }
  },

  //查看详情
  essayClick: function(e) {
    console.log(e.target.dataset.essayid)
    var essayId = e.target.dataset.essayid
    var userId = app.globalData.openId
    console.log(essayId)
    wx.navigateTo({
      url: './essayDetail/essayDetail?essayId=' + essayId + '&userId=' + userId,
    })
  },
  // 查看个人主页
  openPersonalIndex: function(e) {
    if (app.globalData.openId === "") {
      wx.navigateTo({
        url: '../../index/index'
      })
    }else{
      console.log("个人主页", e.target.dataset);
      var userid = e.target.dataset.userid;
      var usernickname = e.target.dataset.usernickname;
      var useravatar = e.target.dataset.useravatar;
      if (userid != app.globalData.openId) {
        wx.navigateTo({
          url: './essayPersonalIndex/essayPersonalIndex?userid=' + userid + '&userNickName=' + usernickname + '&userAvatar=' + useravatar,
        })
      } else {
        wx.navigateTo({
          url: '../personal/essay/essay',
        })
      }
    }
  },

  essayNew: function() {
    if (app.globalData.openId === "") {
      wx.navigateTo({
        url: '../../index/index'
      })
    }else{
      wx.navigateTo({
        url: './essayNew/essayNew',
      })
    }
  },
  // 预览图片
  essayPic: function(e) {
    console.log(e.target.dataset.index);
    console.log(e.target.dataset.index1);
    console.log(e.target.dataset.essayid);
    let urls_ = []
    var index = e.target.dataset.index;
    for(var i = 0; i<this.data.essays[index].fileRecord.length; i++){
      console.log(this.data.essays[index].fileRecord[i].fileAddr);
      urls_.push(this.data.path + this.data.essays[index].fileRecord[i].fileAddr);
    }
    console.log(urls_)
    wx.previewImage({
      current: urls_[e.target.dataset.index1], // 当前显示图片的http链接
      urls: urls_ // 需要预览的图片http链接列表
    })
  },
  // 滚动加载
  loadMore: function() {
    console.log("load more")
    this.requestEssayList()
  },
  refresh: function() {
    console.log("refresh")
    this.refreshEssayList()
  },
  bindPlay: function() {
    this.videoContext.play()
  },
  bindPause: function() {
    this.videoContext.pause()
  },
  videoErrorCallback: function(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  }
})