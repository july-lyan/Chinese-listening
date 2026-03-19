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
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.filterQuestionsByDifficulty();
        this.loadQuestion(0);
        this.handleHashChange();
        this.applyTheme();
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
            document.getElementById('question-text').textContent = question.question;
            
            // 更新图片
            document.getElementById('image-a').src = question.imagePath;
            document.getElementById('image-b').src = question.imagePath;
            
            // 更新选项
            const options = document.querySelectorAll('.option');
            options.forEach((option, i) => {
                option.textContent = question.options[i];
                option.classList.remove('selected');
                option.classList.remove('correct');
                option.classList.remove('incorrect');
            });
            
            // 隐藏反馈区域
            const feedbackContainer = document.getElementById('feedback-container');
            feedbackContainer.style.display = 'none';
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
                this.loadQuestion(0);
                this.saveSettings();
                window.location.hash = 'practice';
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