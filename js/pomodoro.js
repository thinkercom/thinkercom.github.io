class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25分钟，以秒为单位
        this.breakTime = 5 * 60; // 5分钟
        this.currentTime = this.workTime;
        this.isRunning = false;
        this.isWorkSession = true;
        this.timerId = null;
        this.initializeElements();
        this.loadSettings();
    }
    
    initializeElements() {
        this.timerDisplay = document.getElementById('timer-display');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.workDuration = document.getElementById('work-duration');
        this.breakDuration = document.getElementById('break-duration');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.workDuration.addEventListener('change', () => this.updateWorkTime());
        this.breakDuration.addEventListener('change', () => this.updateBreakTime());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.tick(), 1000);
        }
    }
    
    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }
    
    reset() {
        this.pause();
        this.isWorkSession = true;
        this.currentTime = this.workTime;
        this.updateDisplay();
    }
    
    tick() {
        this.currentTime--;
        this.updateDisplay();
        
        if (this.currentTime <= 0) {
            this.playNotification();
            this.switchSession();
        }
    }
    
    switchSession() {
        this.isWorkSession = !this.isWorkSession;
        this.currentTime = this.isWorkSession ? this.workTime : this.breakTime;
        this.updateDisplay();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新进度条
        const totalTime = this.isWorkSession ? this.workTime : this.breakTime;
        const progress = ((totalTime - this.currentTime) / totalTime) * 100;
        this.updateProgressBar(progress);
    }
    
    updateProgressBar(progress) {
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.width = `${progress}%`;
    }
    
    playNotification() {
        // 播放通知声音
        const audio = new Audio('assets/sounds/notification.mp3');
        audio.play();
        
        // 显示浏览器通知
        if (Notification.permission === 'granted') {
            new Notification(this.isWorkSession ? '休息时间!' : '工作时间!', {
                body: this.isWorkSession ? '该休息一下了' : '该开始工作了',
                icon: 'assets/images/icon.png'
            });
        }
    }
    
    updateWorkTime() {
        this.workTime = parseInt(this.workDuration.value) * 60;
        if (!this.isRunning && this.isWorkSession) {
            this.currentTime = this.workTime;
            this.updateDisplay();
        }
    }
    
    updateBreakTime() {
        this.breakTime = parseInt(this.breakDuration.value) * 60;
        if (!this.isRunning && !this.isWorkSession) {
            this.currentTime = this.breakTime;
            this.updateDisplay();
        }
    }
    
    loadSettings() {
        // 从localStorage加载设置
        const savedWorkTime = localStorage.getItem('pomodoroWorkTime');
        const savedBreakTime = localStorage.getItem('pomodoroBreakTime');
        
        if (savedWorkTime) {
            this.workTime = parseInt(savedWorkTime);
            this.workDuration.value = this.workTime / 60;
        }
        
        if (savedBreakTime) {
            this.breakTime = parseInt(savedBreakTime);
            this.breakDuration.value = this.breakTime / 60;
        }
        
        this.updateDisplay();
    }
    
    saveSettings() {
        localStorage.setItem('pomodoroWorkTime', this.workTime);
        localStorage.setItem('pomodoroBreakTime', this.breakTime);
    }
}

// 初始化番茄时钟
document.addEventListener('DOMContentLoaded', () => {
    const pomodoroTimer = new PomodoroTimer();
});