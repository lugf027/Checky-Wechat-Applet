// pages/tab/personal/supHistory/supHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    supList: [],
    pageRequest: 1,
    pageSize: 10,
    infomation: "loading",
    icon: "https://wx.qlogo.cn/mmopen/vi_32/mg86W2NaRPUPJ4ZJiau8RuMAb6WAkRYoS78cPkGMrsbaUAiaiajOPC3MTAAkZ6sXkMcdlJWlymXibTco8VicsEgvlRA/132",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadMore();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  loadMore: function() {
    console.log("supLoadMore")
    var that = this;
    req = {
      url: '/supervise/history',
      method: 'POST',
      data: {
        userId: app.globalData.openId,
        pageRequest: this.data.pageRequest,
        pageSize: this.data.pageSize,
      },
      success: res => {
        console.log(res.data);

        // for (var i = 0; i < res.data.supList.length; i++) {
        //   if (res.data.supList[i].title.length > 15){
        //     res.data.supList[i].title = res.data.supList[i].title.substring(0, 14) + '...';
        //   }
        //   if(res.data.supList[i].checkName.length > 6){
        //     res.data.supList[i].checkName = res.data.supList[i].checkName.substring(0, 5)+'...';
        //   }
        //   if(res.data.supList[i].taskType.length > 4){
        //     res.data.supList[i].taskType = res.data.supList[i].taskType.substring(0, 3)+'...';
        //   }
        // }
        that.setData({
          supList: that.data.supList.concat(res.data.supList),
          pageRequest: that.data.pageRequest + 1,
        });
        if (res.data.supList.length < 10) {
          that.setData({
            infomation: "nomore"
          });
        }
      },
      fail: err => {
        console.log(err)
      }
    }
    app.requestWithAuth(req)
      .then(req.success)
      .catch(req.fail)
  },

  checkDetail: function(options) {
    checkid = options.target.dataset.checkid;
    checkstate = options.target.dataset.checkstate;
    taskid = options.target.dataset.taskid;
    console.log("checkDetail", options.target.dataset)
    wx.navigateTo({
      url: '../../tasks/taskDetail/taskDetail?taskId=' + taskid + '&checkState=' + checkstate + '&checkId=' + checkid,
    })
  }
})