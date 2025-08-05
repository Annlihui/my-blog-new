// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
});

// 博客初始化函数
function initializeBlog() {
    // 初始化导航栏交互
    initNavigation();
    
    // 初始化文章卡片交互
    initPostCards();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化主题切换（可选）
    initThemeToggle();
    
    // 初始化搜索功能（可选）
    initSearch();
}

// ========== 路由相关 ========== //
window.addEventListener('hashchange', handleRoute);

function handleRoute() {
    const hash = location.hash.replace(/^#\/?/, '');
    if (!hash || hash === '' || hash === 'home') {
        renderHomePage();
    } else if (hash.startsWith('post/')) {
        const postTitle = decodeURIComponent(hash.replace('post/', ''));
        renderPostDetail(postTitle);
    } else if (hash === 'about') {
        renderAboutPage();
    } else if (hash === 'contact') {
        renderContactPage();
    } else {
        renderNotFound();
    }
}

function renderHomePage() {
    document.querySelector('.main').innerHTML = window._mainHomeHTML;
    initPostCards();
    initSearch && initSearch();
}

function renderPostDetail(title) {
    // 查找对应文章卡片
    const cards = document.querySelectorAll('.post-card');
    let found = null;
    cards.forEach(card => {
        if (card.querySelector('.post-title').textContent === title) {
            found = card.cloneNode(true);
        }
    });
    const main = document.querySelector('.main');
    if (found) {
        main.innerHTML = `<section class='post-detail'>${found.innerHTML}<button class='back-btn'>返回</button></section>`;
        main.querySelector('.back-btn').onclick = () => { location.hash = ''; };
    } else {
        main.innerHTML = '<section class="not-found"><h2>未找到该文章</h2></section>';
    }
}

function renderAboutPage() {
    document.querySelector('.main').innerHTML = `<section class='about'><h2>关于我</h2><div class='about-content'><p>我是热爱技术和写作的开发者，喜欢分享知识和经验。</p><p>这里会记录我的学习历程、技术心得和生活感悟。</p></div></section>`;
}

function renderContactPage() {
    document.querySelector('.main').innerHTML = `<section class='contact'><h2>联系我</h2><div class='contact-content'><p>邮箱：your@email.com</p><p>欢迎交流！</p></div></section>`;
}

function renderNotFound() {
    document.querySelector('.main').innerHTML = '<section class="not-found"><h2>页面未找到</h2></section>';
}

// 保存主页初始 HTML 以便切换回来
window.addEventListener('DOMContentLoaded', function() {
    window._mainHomeHTML = document.querySelector('.main').innerHTML;
    handleRoute();
});

// 优化导航栏点击事件，切换 hash
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const page = this.textContent.trim();
            if (page === '首页') {
                location.hash = '';
            } else if (page === '文章') {
                location.hash = '';
            } else if (page === '关于') {
                location.hash = 'about';
            } else if (page === '联系') {
                location.hash = 'contact';
            }
        });
    });
}

// 优化文章卡片点击事件，跳转到详情页
function initPostCards() {
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return;
            const title = this.querySelector('.post-title').textContent;
            location.hash = 'post/' + encodeURIComponent(title);
        });
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        card.setAttribute('tabindex', '0');
    });
}

// 平滑滚动
function initSmoothScroll() {
    // 为所有内部链接添加平滑滚动
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 主题切换功能（可选）
function initThemeToggle() {
    // 检查是否支持主题切换
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 创建主题切换按钮
    const themeToggle = document.createElement('button');
    themeToggle.textContent = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', '切换主题');
    
    // 添加样式
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #e5e5e5;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
        z-index: 1000;
    `;
    
    // 添加悬停效果
    themeToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    themeToggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // 主题切换逻辑
    themeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            document.body.classList.remove('dark-theme');
            this.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            this.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // 添加到页面
    document.body.appendChild(themeToggle);
    
    // 检查本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
}

// 搜索功能（可选）
function initSearch() {
    // 创建搜索框
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" placeholder="搜索文章..." class="search-input">
        <button class="search-button">🔍</button>
    `;
    
    // 添加搜索样式
    const searchStyles = `
        .search-container {
            display: flex;
            gap: 10px;
            margin-bottom: 2rem;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .search-input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
        }
        
        .search-input:focus {
            border-color: #007acc;
        }
        
        .search-button {
            padding: 10px 15px;
            background: #007acc;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .search-button:hover {
            background: #005a9e;
        }
    `;
    
    // 添加样式到页面
    const styleSheet = document.createElement('style');
    styleSheet.textContent = searchStyles;
    document.head.appendChild(styleSheet);
    
    // 插入到文章区域前面
    const postsSection = document.querySelector('.posts');
    postsSection.parentNode.insertBefore(searchContainer, postsSection);
    
    // 搜索功能
    const searchInput = searchContainer.querySelector('.search-input');
    const searchButton = searchContainer.querySelector('.search-button');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const postCards = document.querySelectorAll('.post-card');
        
        postCards.forEach(card => {
            const title = card.querySelector('.post-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.post-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.post-category').textContent.toLowerCase();
            
            const matches = title.includes(query) || 
                          excerpt.includes(query) || 
                          category.includes(query);
            
            card.style.display = matches ? 'block' : 'none';
        });
    }
    
    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);
    
    // 回车键搜索
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 页面可见性API - 当用户切换标签页时
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('用户离开了页面');
    } else {
        console.log('用户回到了页面');
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 性能监控
window.addEventListener('load', function() {
    // 页面加载时间
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`页面加载时间: ${loadTime}ms`);
});