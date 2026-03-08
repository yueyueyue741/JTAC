document.addEventListener('DOMContentLoaded', () => {
    // 初始化图标
    feather.replace();

    const loadingScreen = document.getElementById('loading-screen');
    const mainSpace = document.getElementById('main-space');
    const progressBar = document.querySelector('.progress-bar');

    // 1. 模拟加载流程 (Section 7.1)
    const initApp = async () => {
        // 进度条动画
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 100);

        // 保证最短展示时间 1500ms [cite: 78]
        await new Promise(resolve => setTimeout(resolve, 1800));

        // 退场动画
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mainSpace.classList.remove('hidden');
            // 触发主空间进入动画
            mainSpace.style.animation = 'fadeIn 0.5s ease-out';
        }, 300);
    };

    // 2. 交互逻辑
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelector('.nav-item.active').classList.remove('active');
            this.classList.add('active');
            console.log(`切换到: ${this.innerText}`);
        });
    });

    document.getElementById('enter-world').addEventListener('click', () => {
        console.log('正在跳转至世界对话界面...');
        // 此处后续对接 world-context.js
    });

    // 启动应用
    initApp();
});