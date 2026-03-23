class ChineseListeningApp {
    constructor() {
        this.currentPage = 'home';
        this.settings = {
            difficulty: 'medium',
            audioSpeed: 1.0,
            theme: 'light'
        };
        this.currentQuestionIndex = 0;
        this.filteredQuestions = [];
        this.answers = {}; // 存储用户的答题结果
        this.audioContext = null;
        this.supabase = null; // 稍后初始化
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.filterQuestionsByDifficulty();
        // 初始化Supabase
        console.log('开始初始化Supabase');
        if (typeof supabase !== 'undefined') {
            console.log('Supabase SDK已加载');
            try {
                console.log('开始创建Supabase客户端');
                // 从环境变量读取Supabase配置
                let supabaseUrl = ''
                let supabaseKey = ''
                
                // 尝试从环境变量读取（支持浏览器和Node.js环境）
                if (typeof process !== 'undefined' && process.env) {
                  supabaseUrl = process.env.Project_URL || ''
                  supabaseKey = process.env.Publishable_Key || ''
                } else if (typeof window !== 'undefined' && window.env) {
                  // 浏览器环境中的环境变量
                  supabaseUrl = window.env?.Project_URL || ''
                  supabaseKey = window.env?.Publishable_Key || ''
                }
                
                // 如果环境变量中没有，使用默认值
                if (!supabaseUrl) supabaseUrl = 'https://jvukpyjiufkfftrnuqjh.supabase.co'
                if (!supabaseKey) supabaseKey = 'sb_publishable_mXFmf7gE96PsYJ_DNSoojA_I7ahV41Y'
                
                console.log('使用的Supabase URL:', supabaseUrl);
                console.log('使用的Supabase Key:', supabaseKey ? '***' : '未设置');
                
                this.supabase = supabase.createClient(
                    supabaseUrl,
                    supabaseKey
                );
                console.log('Supabase客户端创建成功:', this.supabase);
                // 测试连接
                this.testSupabaseConnection();
            } catch (error) {
                console.error('创建Supabase客户端失败:', error);
                console.error('失败详情:', JSON.stringify(error));
            }
        } else {
            console.error('Supabase SDK未加载');
        }
        // 移除初始化时加载问题，因为此时练习页面还没有显示
        this.handleHashChange();
        this.applyTheme();
    }
    
    async testSupabaseConnection() {
        try {
            console.log('测试Supabase连接');
            console.log('Supabase客户端:', this.supabase);
            if (!this.supabase) {
                console.error('Supabase客户端未创建');
                return;
            }
            console.log('开始测试scores表访问');
            // 尝试使用最简单的查询
            const { data, error } = await this.supabase
                .from('scores')
                .select('*')
                .limit(1);
            
            if (error) {
                console.error('Supabase连接测试失败:', error);
                console.error('错误详情:', JSON.stringify(error));
                console.error('错误代码:', error.code);
                console.error('错误提示:', error.hint);
                // 检查是否是行级安全策略问题
                if (error.code === '42501') {
                    console.error('行级安全策略阻止了访问，请在Supabase控制台中配置RLS策略');
                    alert('Supabase行级安全策略阻止了访问，请在Supabase控制台中配置RLS策略');
                } else {
                    // 尝试创建表结构
                    this.createScoresTable();
                }
            } else {
                console.log('Supabase连接测试成功:', data);
            }
        } catch (error) {
            console.error('Supabase连接测试异常:', error);
            console.error('异常详情:', JSON.stringify(error));
        }
    }
    
    async createScoresTable() {
        try {
            console.log('尝试创建scores表');
            // 注意：在实际应用中，表结构应该在Supabase控制台中创建
            // 这里尝试使用不同的字段名称，可能表结构已经存在但字段名称不同
            const { data, error } = await this.supabase
                .from('scores')
                .insert({
                    player_name: 'test',
                    points: 0,
                    created_at: new Date().toISOString()
                });
            
            if (error) {
                console.error('创建表失败:', error);
                // 尝试使用更简单的结构
                this.createSimpleScoresTable();
            } else {
                console.log('表创建成功:', data);
            }
        } catch (error) {
            console.error('创建表异常:', error);
        }
    }
    
    async createSimpleScoresTable() {
        try {
            console.log('尝试创建简单的scores表');
            // 尝试使用最基本的字段
            const { data, error } = await this.supabase
                .from('scores')
                .insert({});
            
            if (error) {
                console.error('创建简单表失败:', error);
                console.error('错误详情:', JSON.stringify(error));
                // 尝试检查表结构
                this.checkTableStructure();
            } else {
                console.log('简单表创建成功:', data);
            }
        } catch (error) {
            console.error('创建简单表异常:', error);
        }
    }
    
    async checkTableStructure() {
        try {
            console.log('尝试检查表结构');
            // 尝试获取表的列信息
            // 注意：这需要使用Supabase的Admin API或SQL查询
            // 这里我们尝试使用不同的查询方式来推断表结构
            const { data, error } = await this.supabase
                .from('scores')
                .select('*')
                .limit(1);
            
            if (error) {
                console.error('检查表结构失败:', error);
                console.error('错误详情:', JSON.stringify(error));
                // 尝试创建一个新的表
                this.createNewScoresTable();
            } else {
                console.log('表结构查询成功:', data);
                if (data && data.length > 0) {
                    console.log('表列信息:', Object.keys(data[0]));
                }
            }
        } catch (error) {
            console.error('检查表结构异常:', error);
            console.error('异常详情:', JSON.stringify(error));
        }
    }
    
    async createNewScoresTable() {
        try {
            console.log('尝试创建新的scores表');
            // 注意：在实际应用中，表结构应该在Supabase控制台中创建
            // 这里我们尝试使用Supabase的API来创建表
            // 但是，这需要使用服务端密钥，而不是客户端密钥
            // 所以我们这里只是尝试，可能会失败
            const { data, error } = await this.supabase
                .rpc('create_scores_table');
            
            if (error) {
                console.error('创建新表失败:', error);
                console.error('错误详情:', JSON.stringify(error));
                // 尝试使用不同的方法
                this.tryDifferentApproach();
            } else {
                console.log('新表创建成功:', data);
            }
        } catch (error) {
            console.error('创建新表异常:', error);
            console.error('异常详情:', JSON.stringify(error));
            // 尝试使用不同的方法
            this.tryDifferentApproach();
        }
    }
    
    tryDifferentApproach() {
        console.log('尝试不同的方法');
        // 由于我们无法修改数据库结构，我们需要使用本地存储作为主要方案
        // 并向用户提供明确的说明
        alert('无法连接到Supabase数据库，请在Supabase控制台中创建scores表并配置RLS策略。现在将使用本地存储来保存成绩。');
    }

    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playCorrectSound() {
        this.initAudioContext();
        
        // 创建叮咚音效
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 叮咚音效：先高音再低音
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.2);
        
        // 音量控制
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        // 播放
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    playIncorrectSound() {
        this.initAudioContext();
        
        // 创建嗡嗡音效
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 嗡嗡音效：低频振动
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.5);
        
        // 音量控制
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        // 播放
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    filterQuestionsByDifficulty() {
        this.filteredQuestions = questions.filter(q => q.difficulty === this.settings.difficulty);
        if (this.filteredQuestions.length === 0) {
            // 如果没有对应难度的题目，使用所有题目
            this.filteredQuestions = questions;
        }
        this.currentQuestionIndex = 0;
    }

    loadQuestion(index) {
        if (index >= 0 && index < this.filteredQuestions.length) {
            this.currentQuestionIndex = index;
            const question = this.filteredQuestions[index];
            
            // 检查元素是否存在，避免在页面未加载时出错
            const questionText = document.getElementById('question-text');
            if (questionText) {
                questionText.textContent = question.question;
            }
            
            // 更新图片
            const imageContainer = document.querySelector('.image-container');
            if (imageContainer) {
                if (question.type === 'select_image') {
                    // 显示图片选择模式
                    imageContainer.style.display = 'flex';
                    const imageA = document.getElementById('image-a');
                    const imageB = document.getElementById('image-b');
                    if (imageA) imageA.src = question.imagePathA || question.imagePath;
                    if (imageB) imageB.src = question.imagePathB || question.imagePath;
                } else {
                    // 隐藏图片，显示句子选择模式
                    imageContainer.style.display = 'none';
                }
            }
            
            // 更新选项容器
            const optionsContainer = document.querySelector('.options');
            if (optionsContainer) {
                if (question.type === 'select_sentence') {
                    // 显示句子选择模式
                    optionsContainer.style.display = 'block';
                } else {
                    // 隐藏句子选项，显示图片选择模式
                    optionsContainer.style.display = 'none';
                }
            }
            
            // 更新选项
            const options = document.querySelectorAll('.option');
            options.forEach((option, i) => {
                if (i < question.options.length) {
                    option.textContent = question.options[i];
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
                option.classList.remove('selected');
                option.classList.remove('correct');
                option.classList.remove('incorrect');
            });
            
            // 隐藏反馈区域
            const feedbackContainer = document.getElementById('feedback-container');
            if (feedbackContainer) {
                feedbackContainer.style.display = 'none';
            }
        }
    }

    updateProgress() {
        const progressElement = document.getElementById('audio-progress');
        const playButton = document.getElementById('play-audio');
        
        if (playButton.textContent === '暂停') {
            // 播放中，显示播放状态
            progressElement.textContent = '播放中...';
        } else {
            // 未播放，显示准备状态
            progressElement.textContent = '0:00 / 0:00';
        }
    }

    setupEventListeners() {
        // 导航链接点击事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                window.location.hash = href.substring(1);
            });
        });

        // 难度选择按钮
        document.querySelectorAll('.difficulty-button').forEach(button => {
            button.addEventListener('click', () => {
                const difficulty = button.getAttribute('data-difficulty');
                this.settings.difficulty = difficulty;
                this.filterQuestionsByDifficulty();
                // 先切换到练习页面，然后再加载问题
                window.location.hash = 'practice';
                // 延迟加载问题，确保页面已经切换
                setTimeout(() => {
                    this.loadQuestion(0);
                }, 100);
            });
        });

        // 音频播放按钮
        document.getElementById('play-audio').addEventListener('click', () => {
            this.toggleAudio();
        });

        // 选项点击事件
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectOption(option);
            });
        });

        // 图片点击事件（用于图片选择题）
        document.getElementById('image-a').addEventListener('click', () => {
            const question = this.filteredQuestions[this.currentQuestionIndex];
            if (question && question.type === 'select_image') {
                // 模拟选择第一个选项（图片A）
                const options = document.querySelectorAll('.option');
                if (options.length > 0) {
                    this.selectOption(options[0]);
                }
            }
        });

        document.getElementById('image-b').addEventListener('click', () => {
            const question = this.filteredQuestions[this.currentQuestionIndex];
            if (question && question.type === 'select_image') {
                // 模拟选择第二个选项（图片B）
                const options = document.querySelectorAll('.option');
                if (options.length > 1) {
                    this.selectOption(options[1]);
                }
            }
        });

        // 上一题/下一题按钮
        document.getElementById('prev-question').addEventListener('click', () => {
            this.changeQuestion(-1);
        });

        document.getElementById('next-question').addEventListener('click', () => {
            this.changeQuestion(1);
        });

        // 音频速度滑块
        const audioSpeedSlider = document.getElementById('audio-speed');
        const speedValue = document.getElementById('speed-value');
        audioSpeedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            speedValue.textContent = `${value.toFixed(1)}x`;
            this.settings.audioSpeed = value;
        });

        // 保存设置按钮
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        // 主题切换
        document.getElementById('theme').addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.applyTheme();
        });

        // 难度级别切换
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.settings.difficulty = e.target.value;
            this.filterQuestionsByDifficulty();
            this.loadQuestion(0);
            this.updateProgress();
        });

        // 哈希变化事件
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
        
        // 结算页面按钮事件
        document.getElementById('play-again').addEventListener('click', () => {
            this.resetPractice();
            this.showPage('practice');
        });
        
        document.getElementById('change-difficulty').addEventListener('click', () => {
            this.showPage('home');
        });
        
        // 排行榜按钮事件
        document.getElementById('show-leaderboard').addEventListener('click', () => {
            this.showLeaderboard();
        });
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1) || 'home';
        this.showPage(hash);
    }

    showPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;

            // 如果切换到练习页面，加载当前问题
            if (pageId === 'practice') {
                this.loadQuestion(this.currentQuestionIndex);
            }

            // 更新导航链接状态
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${pageId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    selectOption(option) {
        // 移除其他选项的选中状态
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
            opt.classList.remove('correct');
            opt.classList.remove('incorrect');
        });
        // 添加当前选项的选中状态
        option.classList.add('selected');
        
        // 验证答案
        const question = this.filteredQuestions[this.currentQuestionIndex];
        const selectedIndex = Array.from(document.querySelectorAll('.option')).indexOf(option);
        const isCorrect = selectedIndex === question.answer;
        
        // 记录答题结果
        this.answers[question.id] = {
            selected: selectedIndex,
            correct: isCorrect
        };
        
        if (isCorrect) {
            option.classList.add('correct');
            this.playCorrectSound();
        } else {
            option.classList.add('incorrect');
            // 显示正确答案
            const correctOption = document.querySelectorAll('.option')[question.answer];
            correctOption.classList.add('correct');
            this.playIncorrectSound();
        }
        
        // 显示反馈
        this.showFeedback(question, isCorrect);
        
        // 检查是否完成所有题目
        if (Object.keys(this.answers).length === this.filteredQuestions.length) {
            // 延迟显示结果，让用户有时间看到当前题目的反馈
            setTimeout(() => {
                this.showResults();
            }, 1500);
        }
    }
    
    showFeedback(question, isCorrect) {
        // 显示反馈容器
        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.style.display = 'block';
        
        // 设置反馈消息
        const feedbackMessage = document.getElementById('feedback-message');
        feedbackMessage.textContent = isCorrect ? '回答正确！' : '回答错误，再试一次！';
        feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // 显示中文原文
        const chineseText = document.getElementById('chinese-text');
        chineseText.textContent = question.audioText;
        
        // 显示拼音
        const pinyinText = document.getElementById('pinyin-text');
        pinyinText.textContent = question.pinyin;
        
        // 显示英文翻译
        const translationText = document.getElementById('translation-text');
        translationText.textContent = question.translation;
        
        // 错误时高亮关键词
        if (!isCorrect) {
            this.highlightKeywords(question);
        }
    }
    
    highlightKeywords(question) {
        // 简单的关键词高亮逻辑：高亮音频文本中的第一个词
        // 实际应用中可以根据具体需求实现更复杂的高亮逻辑
        const chineseText = document.getElementById('chinese-text');
        const audioText = question.audioText;
        
        // 简单示例：高亮第一个词
        if (audioText) {
            const firstWord = audioText.split(' ')[0];
            if (firstWord) {
                const highlightedText = audioText.replace(firstWord, `<span class="highlight">${firstWord}</span>`);
                chineseText.innerHTML = highlightedText;
            }
        }
    }

    changeQuestion(direction) {
        let newIndex = this.currentQuestionIndex + direction;
        if (newIndex < 0) {
            newIndex = this.filteredQuestions.length - 1;
        } else if (newIndex >= this.filteredQuestions.length) {
            newIndex = 0;
        }
        this.loadQuestion(newIndex);
        this.updateProgress();
    }

    toggleAudio() {
        const playButton = document.getElementById('play-audio');
        const audioWave = document.getElementById('audio-wave');
        
        if (playButton.textContent === '播放') {
            // 开始播放
            playButton.textContent = '暂停';
            playButton.classList.add('playing');
            audioWave.style.display = 'flex';
            
            // 播放音频
            const question = this.filteredQuestions[this.currentQuestionIndex];
            const speech = new SpeechSynthesisUtterance(question.audioText);
            speech.lang = 'zh-CN';
            speech.rate = this.settings.audioSpeed;
            speech.volume = 1; // 设置音量为最大
            speech.pitch = 1; // 设置音调为默认
            
            speech.onstart = () => {
                // 播放开始时的处理
                this.updateProgress();
            };
            
            speech.onend = () => {
                // 播放结束时的处理
                playButton.textContent = '播放';
                playButton.classList.remove('playing');
                audioWave.style.display = 'none';
                this.updateProgress();
            };
            
            speech.onerror = () => {
                // 播放出错时的处理
                playButton.textContent = '播放';
                playButton.classList.remove('playing');
                audioWave.style.display = 'none';
                alert('音频播放失败，请重试');
            };
            
            speechSynthesis.speak(speech);
        } else {
            // 停止播放
            playButton.textContent = '播放';
            playButton.classList.remove('playing');
            audioWave.style.display = 'none';
            speechSynthesis.cancel();
        }
    }

    applyTheme() {
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    saveSettings() {
        localStorage.setItem('chineseListeningSettings', JSON.stringify(this.settings));
        alert('设置已保存');
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('chineseListeningSettings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
            // 更新UI
            document.getElementById('difficulty').value = this.settings.difficulty;
            document.getElementById('audio-speed').value = this.settings.audioSpeed;
            document.getElementById('speed-value').textContent = `${this.settings.audioSpeed.toFixed(1)}x`;
            document.getElementById('theme').value = this.settings.theme;
        }
    }
    
    showResults() {
        // 计算总分和正确题数
        const correctCount = Object.values(this.answers).filter(answer => answer.correct).length;
        const totalCount = this.filteredQuestions.length;
        const score = Math.round((correctCount / totalCount) * 100);
        
        // 更新分数显示
        document.getElementById('total-score').textContent = score;
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('total-count').textContent = totalCount;
        
        // 生成答题回顾
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = '';
        
        this.filteredQuestions.forEach((question, index) => {
            const answer = this.answers[question.id];
            const isCorrect = answer ? answer.correct : false;
            
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            reviewItem.innerHTML = `
                <div class="review-item-header">
                    <span class="review-question-number">第 ${index + 1} 题</span>
                    <span class="review-result">${isCorrect ? '正确' : '错误'}</span>
                </div>
                <div class="review-item-content">
                    <p class="review-question">${question.question}</p>
                    <div class="review-options">
                        ${question.options.map((option, i) => {
                            const isSelected = answer && answer.selected === i;
                            const isCorrectAnswer = i === question.answer;
                            return `
                                <div class="review-option ${isSelected ? 'selected' : ''} ${isCorrectAnswer ? 'correct-answer' : ''}">
                                    <span class="option-label">${String.fromCharCode(65 + i)}</span>
                                    <span class="option-text">${option}</span>
                                    ${isSelected && !isCorrect ? '<span class="selected-mark">✗</span>' : ''}
                                    ${isCorrectAnswer ? '<span class="correct-mark">✓</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="review-audio-text">
                        <span class="text-label">音频文本：</span>
                        <span class="text-content">${question.audioText}</span>
                    </div>
                </div>
            `;
            
            reviewList.appendChild(reviewItem);
        });
        
        // 显示结果页面
        this.showPage('results');
        
        // 弹出输入框让用户填名字
        setTimeout(() => {
            this.saveScore(score, correctCount, totalCount);
        }, 1000);
    }
    
    async saveScore(score, correctCount, totalCount) {
        const playerName = prompt('请输入您的名字，保存您的成绩：');
        if (playerName && playerName.trim() !== '') {
            try {
                // 尝试使用Supabase保存成绩
                if (this.supabase) {
                    console.log('开始使用Supabase保存成绩:', {
                        player_name: playerName.trim(),
                        level: this.settings.difficulty === 'easy' ? 1 : this.settings.difficulty === 'medium' ? 2 : 3,
                        score: score,
                        total: totalCount
                    });
                    try {
                        // 使用正确的字段名称
                        const { data, error } = await this.supabase
                            .from('scores')
                            .insert({
                                player_name: playerName.trim(),
                                level: this.settings.difficulty === 'easy' ? 1 : this.settings.difficulty === 'medium' ? 2 : 3,
                                score: score,
                                total: totalCount
                            });
                        
                        if (error) {
                            console.error('Supabase保存成绩失败:', error);
                            console.error('错误详情:', JSON.stringify(error));
                            // 检查是否是行级安全策略问题
                            if (error.code === '42501') {
                                console.error('行级安全策略阻止了保存，请在Supabase控制台中配置RLS策略');
                                alert('Supabase行级安全策略阻止了保存，请在Supabase控制台中配置RLS策略。现在将使用本地存储来保存成绩。');
                            } else {
                                alert('保存成绩失败，请稍后再试。现在将使用本地存储来保存成绩。');
                            }
                            // 保存到本地作为备用
                            this.saveScoreToLocalStorage(playerName.trim(), score);
                        } else {
                            console.log('Supabase成绩保存成功:', data);
                            alert('成绩保存成功！');
                        }
                    } catch (error) {
                        console.error('Supabase保存成绩时出错:', error);
                        // 出错时使用本地存储作为备用
                        this.saveScoreToLocalStorage(playerName.trim(), score);
                    }
                } else {
                    // Supabase未初始化，使用本地存储
                    this.saveScoreToLocalStorage(playerName.trim(), score);
                }
            } catch (error) {
                console.error('保存成绩时出错:', error);
                alert('保存成绩时出错，请稍后再试');
            }
        }
    }
    
    async saveScoreWithAlternativeFields(name, score) {
        try {
            console.log('尝试使用替代字段保存成绩:', {
                username: name,
                score: score
            });
            const { data, error } = await this.supabase
                .from('scores')
                .insert({
                    username: name,
                    score: score
                });
            
            if (error) {
                console.error('使用替代字段保存成绩失败:', error);
                console.error('错误详情:', JSON.stringify(error));
                console.error('错误代码:', error.code);
                console.error('错误提示:', error.hint);
                // 检查是否是行级安全策略问题
                if (error.code === '42501') {
                    console.error('行级安全策略阻止了保存，请在Supabase控制台中配置RLS策略');
                    alert('Supabase行级安全策略阻止了保存，请在Supabase控制台中配置RLS策略');
                }
                // 失败时使用本地存储作为备用
                this.saveScoreToLocalStorage(name, score);
            } else {
                console.log('使用替代字段成绩保存成功:', data);
                alert('成绩保存成功！');
            }
        } catch (error) {
            console.error('使用替代字段保存成绩时出错:', error);
            console.error('异常详情:', JSON.stringify(error));
            // 出错时使用本地存储作为备用
            this.saveScoreToLocalStorage(name, score);
        }
    }
    
    saveScoreToLocalStorage(name, score) {
        try {
            console.log('使用本地存储保存成绩:', { name, score });
            // 从本地存储获取现有成绩
            const existingScores = JSON.parse(localStorage.getItem('chineseListeningScores') || '[]');
            // 添加新成绩
            existingScores.push({
                name: name,
                score: score,
                created_at: new Date().toISOString()
            });
            // 按分数降序排序
            existingScores.sort((a, b) => b.score - a.score);
            // 只保留前10名
            const topScores = existingScores.slice(0, 10);
            // 保存回本地存储
            localStorage.setItem('chineseListeningScores', JSON.stringify(topScores));
            console.log('本地存储成绩保存成功');
            alert('成绩已保存到本地！');
        } catch (error) {
            console.error('本地存储保存成绩失败:', error);
            alert('保存成绩失败，请稍后再试');
        }
    }
    
    async showLeaderboard() {
        try {
            // 尝试使用Supabase获取排行榜
            if (this.supabase) {
                console.log('开始使用Supabase获取排行榜');
                try {
                    // 使用正确的字段名称，按照level、score和created_at排序
                    const { data, error } = await this.supabase
                        .from('scores')
                        .select('player_name, score, created_at, level')
                        .order('level', { ascending: true })
                        .order('score', { ascending: false })
                        .order('created_at', { ascending: false });
                    
                    if (error) {
                        console.error('Supabase获取排行榜失败:', error);
                        console.error('错误详情:', JSON.stringify(error));
                        // 失败时使用本地存储作为备用
                        this.showLocalLeaderboard();
                    } else {
                        console.log('Supabase获取排行榜成功:', data);
                        // 检查数据是否包含level字段
                        if (data && data.length > 0) {
                            console.log('数据包含level字段:', 'level' in data[0]);
                            console.log('第一个数据项:', data[0]);
                        }
                        // 按照难度等级分组显示
                        console.log('调用displayLeaderboardByLevel方法');
                        this.displayLeaderboardByLevel(data);
                    }
                } catch (error) {
                    console.error('Supabase获取排行榜时出错:', error);
                    // 出错时使用本地存储作为备用
                    this.showLocalLeaderboard();
                }
            } else {
                // Supabase未初始化，使用本地存储
                this.showLocalLeaderboard();
            }
        } catch (error) {
            console.error('显示排行榜时出错:', error);
            alert('显示排行榜时出错，请稍后再试');
        }
    }
    
    showLocalLeaderboard() {
        try {
            console.log('使用本地存储显示排行榜');
            // 从本地存储获取成绩
            const scores = JSON.parse(localStorage.getItem('chineseListeningScores') || '[]');
            // 由于本地存储的成绩没有难度等级信息，直接显示
            this.displayLeaderboard(scores);
        } catch (error) {
            console.error('显示本地排行榜时出错:', error);
            alert('显示排行榜时出错，请稍后再试');
        }
    }
    
    displayLeaderboard(data) {
        // 生成排行榜HTML
        let leaderboardHTML = '<h3>排行榜</h3><table><tr><th>排名</th><th>姓名</th><th>得分</th><th>日期</th></tr>';
        if (data && data.length > 0) {
            data.forEach((item, index) => {
                const date = new Date(item.created_at).toLocaleString();
                leaderboardHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.score}</td>
                        <td>${date}</td>
                    </tr>
                `;
            });
        } else {
            leaderboardHTML += '<tr><td colspan="4">暂无数据</td></tr>';
        }
        leaderboardHTML += '</table>';
        
        // 显示排行榜
        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (leaderboardContainer) {
            leaderboardContainer.innerHTML = leaderboardHTML;
            leaderboardContainer.style.display = 'block';
        } else {
            // 如果没有排行榜容器，创建一个
            const resultsContainer = document.querySelector('.results-container');
            if (resultsContainer) {
                const newLeaderboardContainer = document.createElement('div');
                newLeaderboardContainer.id = 'leaderboard-container';
                newLeaderboardContainer.className = 'leaderboard-container';
                newLeaderboardContainer.innerHTML = leaderboardHTML;
                resultsContainer.appendChild(newLeaderboardContainer);
            }
        }
    }
    
    displayLeaderboardByLevel(data) {
        console.log('开始处理排行榜数据:', data);
        // 按照难度等级分组
        const levelGroups = {
            1: { name: '初级', data: [] },
            2: { name: '中级', data: [] },
            3: { name: '高级', data: [] }
        };
        
        // 分类数据
        if (data && data.length > 0) {
            data.forEach(item => {
                console.log('处理数据项:', item);
                // 检查是否有level字段
                if (item.level) {
                    console.log('数据项包含level字段:', item.level);
                    if (levelGroups[item.level]) {
                        levelGroups[item.level].data.push({
                            name: item.player_name || item.name,
                            score: item.score,
                            created_at: item.created_at
                        });
                    }
                } else {
                    console.log('数据项不包含level字段，放入默认组');
                    // 如果没有level字段，放入中级组
                    levelGroups[2].data.push({
                        name: item.player_name || item.name,
                        score: item.score,
                        created_at: item.created_at
                    });
                }
            });
        }
        
        // 生成排行榜HTML
        let leaderboardHTML = '<h3>排行榜</h3>';
        
        // 遍历每个难度等级
        Object.keys(levelGroups).forEach(level => {
            const group = levelGroups[level];
            console.log('处理难度等级:', group.name, '数据量:', group.data.length);
            if (group.data.length > 0) {
                leaderboardHTML += `<h4>${group.name}</h4>`;
                leaderboardHTML += '<table><tr><th>排名</th><th>姓名</th><th>得分</th><th>日期</th></tr>';
                
                group.data.forEach((item, index) => {
                    const date = new Date(item.created_at).toLocaleString();
                    leaderboardHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.name || '未知'}</td>
                            <td>${item.score || 0}</td>
                            <td>${date}</td>
                        </tr>
                    `;
                });
                
                leaderboardHTML += '</table>';
            }
        });
        
        // 如果没有数据
        if (!data || data.length === 0) {
            leaderboardHTML += '<p>暂无数据</p>';
        }
        
        console.log('生成的排行榜HTML:', leaderboardHTML);
        
        // 显示排行榜
        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (leaderboardContainer) {
            leaderboardContainer.innerHTML = leaderboardHTML;
            leaderboardContainer.style.display = 'block';
        } else {
            // 如果没有排行榜容器，创建一个
            const resultsContainer = document.querySelector('.results-container');
            if (resultsContainer) {
                const newLeaderboardContainer = document.createElement('div');
                newLeaderboardContainer.id = 'leaderboard-container';
                newLeaderboardContainer.className = 'leaderboard-container';
                newLeaderboardContainer.innerHTML = leaderboardHTML;
                resultsContainer.appendChild(newLeaderboardContainer);
            }
        }
    }
    
    resetPractice() {
        // 重置练习状态
        this.answers = {};
        this.currentQuestionIndex = 0;
        this.filterQuestionsByDifficulty();
        this.loadQuestion(0);
        this.updateProgress();
    }
}

// 初始化应用
new ChineseListeningApp();