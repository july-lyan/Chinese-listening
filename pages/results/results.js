// results.js
// 结果页面逻辑

const questions = require('../../data/questions.js');

Page({
  data: {
    score: 0,
    correctCount: 0,
    totalCount: 0,
    reviewItems: [],
    showLeaderboard: false,
    leaderboardData: []
  },
  
  onLoad() {
    // 获取全局应用实例
    const app = getApp();
    
    // 从练习页面获取答题结果
    const answers = app.globalData.answers || {};
    const filteredQuestions = app.globalData.filteredQuestions || [];
    
    // 计算得分
    this.calculateScore(answers, filteredQuestions);
    
    // 生成答题回顾
    this.generateReviewItems(answers, filteredQuestions);
    
    // 保存成绩
    this.saveScore();
  },
  
  // 计算得分
  calculateScore(answers, filteredQuestions) {
    const totalCount = filteredQuestions.length;
    let correctCount = 0;
    
    Object.values(answers).forEach(answer => {
      if (answer.correct) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / totalCount) * 100);
    
    this.setData({
      score: score,
      correctCount: correctCount,
      totalCount: totalCount
    });
  },
  
  // 生成答题回顾
  generateReviewItems(answers, filteredQuestions) {
    const reviewItems = filteredQuestions.map(question => {
      const answer = answers[question.id];
      return {
        id: question.id,
        question: question.question,
        options: question.options,
        answer: question.answer,
        selected: answer ? answer.selected : -1,
        isCorrect: answer ? answer.correct : false,
        audioText: question.audioText
      };
    });
    
    this.setData({ reviewItems: reviewItems });
  },
  
  // 保存成绩
  saveScore() {
    // 获取全局应用实例
    const app = getApp();
    
    // 弹出输入框让用户填名字
    wx.showModal({
      title: '保存成绩',
      content: '请输入您的名字，保存您的成绩：',
      editable: true,
      placeholderText: '请输入名字',
      success: (res) => {
        if (res.confirm && res.content) {
          const playerName = res.content.trim();
          this.saveScoreToCloud(playerName);
        }
      }
    });
  },
  
  // 保存成绩到云数据库
  async saveScoreToCloud(playerName) {
    // 获取全局应用实例
    const app = getApp();
    
    try {
      // 尝试使用云数据库保存成绩
      const db = app.db || app.globalData.db;
      if (db) {
        console.log('开始使用云数据库保存成绩:', {
          player_name: playerName,
          level: app.globalData.settings.difficulty === 'easy' ? 1 : app.globalData.settings.difficulty === 'medium' ? 2 : 3,
          score: this.data.score,
          total: this.data.totalCount
        });
        
        try {
          // 使用云数据库保存成绩
          const result = await db.collection('scores').add({
            data: {
              player_name: playerName,
              level: app.globalData.settings.difficulty === 'easy' ? 1 : app.globalData.settings.difficulty === 'medium' ? 2 : 3,
              score: this.data.score,
              total: this.data.totalCount,
              created_at: new Date()
            }
          });
          
          console.log('云数据库成绩保存成功:', result);
          wx.showToast({
            title: '成绩保存成功！',
            icon: 'success'
          });
        } catch (error) {
          console.error('云数据库保存成绩时出错:', error);
          // 出错时使用本地存储作为备用
          this.saveScoreToLocalStorage(playerName);
        }
      } else {
        // 云数据库未初始化，使用本地存储
        this.saveScoreToLocalStorage(playerName);
      }
    } catch (error) {
      console.error('保存成绩时出错:', error);
      wx.showToast({
        title: '保存成绩时出错，请稍后再试',
        icon: 'none'
      });
    }
  },
  
  // 保存成绩到本地存储
  saveScoreToLocalStorage(name) {
    try {
      // 获取全局应用实例
      const app = getApp();
      const difficulty = app.globalData.settings.difficulty;
      
      console.log('使用本地存储保存成绩:', { name, score: this.data.score, difficulty });
      // 从本地存储获取现有成绩
      const existingScores = JSON.parse(wx.getStorageSync('chineseListeningScores') || '{}');
      // 确保每个难度级别都有一个数组
      if (!existingScores[difficulty]) {
        existingScores[difficulty] = [];
      }
      // 添加新成绩
      existingScores[difficulty].push({
        name: name,
        score: this.data.score,
        created_at: new Date().toISOString()
      });
      // 按分数降序排序
      existingScores[difficulty].sort((a, b) => b.score - a.score);
      // 只保留前10名
      existingScores[difficulty] = existingScores[difficulty].slice(0, 10);
      // 保存回本地存储
      wx.setStorageSync('chineseListeningScores', JSON.stringify(existingScores));
      console.log('本地存储成绩保存成功');
      wx.showToast({
        title: '成绩已保存到本地！',
        icon: 'success'
      });
    } catch (error) {
      console.error('本地存储保存成绩失败:', error);
      wx.showToast({
        title: '保存成绩失败，请稍后再试',
        icon: 'none'
      });
    }
  },
  
  // 再来一次
  playAgain() {
    // 跳转到练习页面（使用switchTab因为练习页面在tabBar中）
    wx.switchTab({
      url: '/pages/practice/practice'
    });
  },
  
  // 换个难度
  changeDifficulty() {
    // 跳转到首页（使用switchTab因为首页在tabBar中）
    wx.switchTab({
      url: '/pages/home/home'
    });
  },
  
  // 显示排行榜
  showLeaderboard() {
    this.loadLeaderboard();
    this.setData({ showLeaderboard: true });
  },
  
  // 关闭排行榜
  closeLeaderboard() {
    this.setData({ showLeaderboard: false });
  },
  
  // 加载排行榜
  async loadLeaderboard() {
    // 获取全局应用实例
    const app = getApp();
    const difficulty = app.globalData.settings.difficulty;
    
    try {
      // 尝试使用云数据库获取排行榜
      const db = app.db || app.globalData.db;
      if (db) {
        console.log('开始使用云数据库获取排行榜:', difficulty);
        try {
          // 使用云数据库获取对应难度的排行榜
          const level = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
          const result = await db.collection('scores')
            .where({ level: level })
            .orderBy('score', 'desc')
            .limit(10)
            .get();
          
          console.log('云数据库查询结果:', result);
          
          if (result.data) {
            console.log('云数据库获取排行榜成功:', result.data);
            // 转换数据格式以匹配显示需求
            const formattedData = result.data.map(item => ({
              name: item.player_name,
              score: item.score,
              date: new Date(item.created_at).toLocaleString()
            }));
            this.setData({ leaderboardData: formattedData });
          } else {
            // 如果data为null或不是数组，使用本地存储作为备用
            console.log('云数据库返回的数据无效，使用本地存储');
            this.loadLocalLeaderboard();
          }
        } catch (error) {
          console.error('云数据库获取排行榜时出错:', error);
          // 出错时使用本地存储作为备用
          this.loadLocalLeaderboard();
        }
      } else {
        // 云数据库未初始化，使用本地存储
        console.log('云数据库未初始化，使用本地存储');
        this.loadLocalLeaderboard();
      }
    } catch (error) {
      console.error('显示排行榜时出错:', error);
      wx.showToast({
        title: '显示排行榜时出错，请稍后再试',
        icon: 'none'
      });
    }
  },
  
  // 加载本地排行榜
  loadLocalLeaderboard() {
    try {
      // 获取全局应用实例
      const app = getApp();
      const difficulty = app.globalData.settings.difficulty;
      
      console.log('使用本地存储显示排行榜:', difficulty);
      // 从本地存储获取成绩
      const scores = JSON.parse(wx.getStorageSync('chineseListeningScores') || '{}');
      // 获取对应难度的成绩
      const difficultyScores = scores[difficulty] || [];
      const formattedData = difficultyScores.map(item => ({
        name: item.name,
        score: item.score,
        date: new Date(item.created_at).toLocaleString()
      }));
      this.setData({ leaderboardData: formattedData });
    } catch (error) {
      console.error('显示本地排行榜时出错:', error);
      wx.showToast({
        title: '显示排行榜时出错，请稍后再试',
        icon: 'none'
      });
    }
  }
})