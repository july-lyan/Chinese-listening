// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    this.initCloud()
  },
  initCloud() {
    try {
      // 初始化云开发
      wx.cloud.init({
        env: 'cloud1-5ggo6pov838eda41', // 替换为你的云开发环境ID
        traceUser: true
      })
      
      // 获取数据库实例
      this.db = wx.cloud.database()
      
      // 同时存储到globalData中，方便其他页面访问
      this.globalData.db = this.db
      
      console.log('Cloud initialized:', this.db)
    } catch (error) {
      console.error('云开发初始化失败:', error)
    }
  },
  globalData: {
    user: null,
    settings: {
      difficulty: 'medium',
      audioSpeed: 1.0,
      theme: 'light'
    },
    currentQuestionIndex: 0,
    filteredQuestions: [],
    answers: {},
    audioContext: null
  }
})