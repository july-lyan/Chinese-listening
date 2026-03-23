// home.js
// 首页逻辑

Page({
  data: {
    // 页面数据
  },
  
  onLoad() {
    // 页面加载
  },
  
  // 开始练习
  startPractice(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    
    // 获取全局应用实例
    const app = getApp();
    
    // 更新全局设置中的难度
    app.globalData.settings.difficulty = difficulty;
    
    // 跳转到练习页面
    wx.switchTab({
      url: '/pages/practice/practice'
    });
  }
})