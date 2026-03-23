// practice.js
// 练习页面逻辑

const questions = require('../../data/questions.js');

Page({
  data: {
    currentQuestion: {},
    currentQuestionIndex: 0,
    filteredQuestions: [],
    answers: {},
    isPlaying: false,
    audioProgress: '0:00 / 0:00',
    selectedOption: -1,
    isAnswered: false,
    isCorrect: false,
    imageAloaded: true,
    imageBloaded: true
  },
  
  onLoad() {
    // 获取全局应用实例
    const app = getApp();
    
    // 过滤问题
    this.filterQuestionsByDifficulty(app.globalData.settings.difficulty);
    
    // 加载第一个问题
    this.loadQuestion(0);
  },
  
  onShow() {
    // 页面显示时，重新根据当前难度过滤题目
    const app = getApp();
    this.filterQuestionsByDifficulty(app.globalData.settings.difficulty);
    this.loadQuestion(0);
  },
  
  onUnload() {
    // 页面卸载时停止音频
    if (this.data.isPlaying && this.audioContext) {
      this.audioContext.stop();
    }
  },
  
  // 过滤问题
  filterQuestionsByDifficulty(difficulty) {
    const filtered = questions.filter(q => q.difficulty === difficulty);
    if (filtered.length === 0) {
      // 如果没有对应难度的题目，使用所有题目
      this.setData({ filteredQuestions: questions });
    } else {
      this.setData({ filteredQuestions: filtered });
    }
    this.setData({ currentQuestionIndex: 0 });
  },
  
  // 加载问题
  loadQuestion(index) {
    const filteredQuestions = this.data.filteredQuestions;
    if (index >= 0 && index < filteredQuestions.length) {
      // 创建问题对象的深拷贝，避免修改原始数据
      const question = JSON.parse(JSON.stringify(filteredQuestions[index]));
      this.setData({
        currentQuestionIndex: index,
        currentQuestion: question,
        selectedOption: -1,
        isAnswered: false,
        isCorrect: false,
        imageAloaded: true,
        imageBloaded: true
      });
    }
  },
  
  // 图片加载成功
  imageLoad(e) {
    // 检查图片是否真正加载成功（不是返回HTML页面）
    const imageUrl = e.currentTarget.src;
    if (imageUrl.includes('text_to_image') && imageUrl.includes('prompt=')) {
      // 对于text_to_image API，使用占位符图片
      if (e.currentTarget.id === 'image-a') {
        const currentQuestion = this.data.currentQuestion;
        const updatedQuestion = { ...currentQuestion };
        updatedQuestion.imagePathA = 'https://via.placeholder.com/300x300?text=Image+A';
        this.setData({ 
          currentQuestion: updatedQuestion,
          imageAloaded: true 
        });
      } else if (e.currentTarget.id === 'image-b') {
        const currentQuestion = this.data.currentQuestion;
        const updatedQuestion = { ...currentQuestion };
        updatedQuestion.imagePathB = 'https://via.placeholder.com/300x300?text=Image+B';
        this.setData({ 
          currentQuestion: updatedQuestion,
          imageBloaded: true 
        });
      }
    } else {
      // 正常图片加载
      if (e.currentTarget.id === 'image-a') {
        this.setData({ imageAloaded: true });
      } else if (e.currentTarget.id === 'image-b') {
        this.setData({ imageBloaded: true });
      }
    }
  },
  
  // 图片加载失败
  imageError(e) {
    console.error('图片加载失败:', e);
    if (e.currentTarget.id === 'image-a') {
      // 图片加载失败时，使用默认占位符图片
      const currentQuestion = this.data.currentQuestion;
      const updatedQuestion = { ...currentQuestion };
      updatedQuestion.imagePathA = 'https://via.placeholder.com/300x300?text=Image+A';
      this.setData({ 
        currentQuestion: updatedQuestion,
        imageAloaded: true 
      });
    } else if (e.currentTarget.id === 'image-b') {
      // 图片加载失败时，使用默认占位符图片
      const currentQuestion = this.data.currentQuestion;
      const updatedQuestion = { ...currentQuestion };
      updatedQuestion.imagePathB = 'https://via.placeholder.com/300x300?text=Image+B';
      this.setData({ 
        currentQuestion: updatedQuestion,
        imageBloaded: true 
      });
    }
  },
  
  // 播放/暂停音频
  toggleAudio() {
    const currentQuestion = this.data.currentQuestion;
    
    if (this.data.isPlaying) {
      // 暂停
      if (this.audioContext) {
        this.audioContext.stop();
      }
      this.setData({ isPlaying: false });
    } else {
      // 播放
      this.setData({ isPlaying: true });
      
      // 先获取百度云TTS的access token
      this.getBaiduAccessToken().then(token => {
        if (token) {
          // 使用微信小程序的InnerAudioContext
          this.audioContext = wx.createInnerAudioContext();
          
          // 使用百度云TTS API
          const text = encodeURIComponent(currentQuestion.audioText);
          const url = `https://tsn.baidu.com/text2audio?tex=${text}&lan=zh&cuid=chinese-listening&ctp=1&tok=${token}`;
          
          this.audioContext.src = url;
          this.audioContext.play();
          
          // 监听播放完成
          this.audioContext.onEnded(() => {
            this.setData({ isPlaying: false });
          });
          
          // 监听播放错误
          this.audioContext.onError((error) => {
            console.error('音频播放失败:', error);
            this.setData({ isPlaying: false });
            // 失败时显示文本提示作为备用
            wx.showToast({
              title: currentQuestion.audioText,
              icon: 'none',
              duration: 3000
            });
          });
        } else {
          this.setData({ isPlaying: false });
          wx.showToast({
            title: '获取音频服务失败，请重试',
            icon: 'none'
          });
        }
      }).catch(error => {
        console.error('获取access token失败:', error);
        this.setData({ isPlaying: false });
        // 失败时显示文本提示作为备用
        wx.showToast({
          title: currentQuestion.audioText,
          icon: 'none',
          duration: 3000
        });
      });
    }
  },
  
  // 获取百度云TTS的access token
  getBaiduAccessToken() {
    return new Promise((resolve, reject) => {
      // 检查本地存储是否有缓存的token
      const cachedToken = wx.getStorageSync('baiduTtsToken');
      const tokenExpire = wx.getStorageSync('baiduTtsTokenExpire');
      const now = Date.now();
      
      // 如果token存在且未过期，直接使用
      if (cachedToken && tokenExpire && now < tokenExpire) {
        resolve(cachedToken);
        return;
      }
      
      // 百度云TTS API信息
      const apiKey = 'INZxXfq5Y7xHITPWs9H7N0ZW';
      const secretKey = 'kGZYrI5iayMAseJU0UVb4AHXkVF5vafx';
      const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
      
      wx.request({
        url: url,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data.access_token) {
            // 缓存token，过期时间设置为24小时
            const expireTime = now + (24 * 60 * 60 * 1000);
            wx.setStorageSync('baiduTtsToken', res.data.access_token);
            wx.setStorageSync('baiduTtsTokenExpire', expireTime);
            resolve(res.data.access_token);
          } else {
            reject(new Error('获取access token失败'));
          }
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  },
  
  // 选择选项
  selectOption(e) {
    // 如果已经回答过，不再处理
    if (this.data.isAnswered) {
      return;
    }
    
    const selectedIndex = parseInt(e.currentTarget.dataset.index);
    const currentQuestion = this.data.currentQuestion;
    const isCorrect = selectedIndex === currentQuestion.answer;
    
    // 更新选中状态
    this.setData({
      selectedOption: selectedIndex,
      isAnswered: true,
      isCorrect: isCorrect
    });
    
    // 记录答题结果
    const answers = this.data.answers;
    answers[currentQuestion.id] = {
      selected: selectedIndex,
      correct: isCorrect
    };
    this.setData({ answers });
    
    // 检查是否完成所有题目
    if (Object.keys(answers).length === this.data.filteredQuestions.length) {
      // 延迟显示结果，让用户有时间看到当前题目的反馈
      setTimeout(() => {
        this.showResults();
      }, 1500);
    }
  },
  
  // 选择图片
  selectImage(e) {
    const selectedIndex = parseInt(e.currentTarget.dataset.index);
    this.selectOption({ currentTarget: { dataset: { index: selectedIndex } } });
  },
  
  // 切换问题
  changeQuestion(e) {
    const direction = parseInt(e.currentTarget.dataset.direction);
    let newIndex = this.data.currentQuestionIndex + direction;
    const filteredQuestions = this.data.filteredQuestions;
    
    if (newIndex < 0) {
      newIndex = filteredQuestions.length - 1;
    } else if (newIndex >= filteredQuestions.length) {
      // 已经完成所有题目，跳转到结果页面
      this.showResults();
      return;
    }
    
    this.loadQuestion(newIndex);
  },
  
  // 显示结果
  showResults() {
    // 获取全局应用实例
    const app = getApp();
    
    // 保存答题结果到全局数据
    app.globalData.answers = this.data.answers;
    app.globalData.filteredQuestions = this.data.filteredQuestions;
    
    // 跳转到结果页面（使用switchTab因为结果页面在tabBar中）
    wx.switchTab({
      url: '/pages/results/results'
    });
  }
})