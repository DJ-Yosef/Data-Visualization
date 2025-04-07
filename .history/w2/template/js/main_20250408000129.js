// DATASETS

// Global variable with 1198 pizza deliveries
//console.log(deliveryData);

// Global variable with 200 customer feedbacks
//console.log(feedbackData);

// 全局变量储存过滤后的数据
let filteredData = [];

// 添加当前语言变量
let currentLang = 'zh';

// 初始化函数
function initialize() {
    filteredData = [...deliveryData];
    updateLanguage();
    updateStats();
    renderBarChart(filteredData);
}

// 数据操作函数 - 用于响应筛选器变化
function dataManipulation() {
    // 获取筛选值
    const selectedArea = document.getElementById('delivery-area').value;
    const selectedOrderType = document.getElementById('order-type').value.toLowerCase();

    // 过滤数据
    filteredData = deliveryData.filter(d => {
        const areaMatch = selectedArea === 'All' || d.area === selectedArea;
        const orderMatch = selectedOrderType === 'all' || d.order_type === selectedOrderType;
        return areaMatch && orderMatch;
    });

    updateStats();
    renderBarChart(filteredData);
}

// 更新统计数据
function updateStats() {
    // 1. 基本配送统计
    const deliveryCount = filteredData.length;
    const pizzaCount = filteredData.reduce((sum, d) => sum + d.count, 0);
    const avgTime = (filteredData.reduce((sum, d) => sum + d.delivery_time, 0) / deliveryCount).toFixed(1);
    const totalSales = filteredData.reduce((sum, d) => sum + d.price, 0).toFixed(2);

    // 2. 获取相关的反馈数据
    const relevantFeedbacks = feedbackData.filter(f =>
        filteredData.some(d => d.delivery_id === f.delivery_id)
    );

    const feedbackCount = relevantFeedbacks.length;
    const qualityCounts = {
        high: relevantFeedbacks.filter(f => f.quality === 'high').length,
        medium: relevantFeedbacks.filter(f => f.quality === 'medium').length,
        low: relevantFeedbacks.filter(f => f.quality === 'low').length
    };

    // 3. 更新DOM
    document.getElementById('delivery-count').textContent = deliveryCount;
    document.getElementById('pizza-count').textContent = pizzaCount;
    document.getElementById('avg-time').textContent = `${avgTime} 分钟`;
    document.getElementById('total-sales').textContent = `$${totalSales}`;

    document.getElementById('feedback-count').textContent = feedbackCount;
    document.getElementById('high-quality').textContent = qualityCounts.high;
    document.getElementById('medium-quality').textContent = qualityCounts.medium;
    document.getElementById('low-quality').textContent = qualityCounts.low;
}

// 语言切换函数
function changeLanguage() {
    currentLang = document.getElementById('language-select').value;
    updateLanguage();
    updateStats(); // 重新渲染统计数据
}

// 更新页面文本
function updateLanguage() {
    const lang = languages[currentLang];

    // 更新标题
    document.querySelector('h1').textContent = lang.title;

    // 更新统计标题
    document.querySelectorAll('.stat-box h4').forEach(element => {
        switch(element.nextElementSibling.id) {
            case 'delivery-count':
                element.textContent = lang.delivery_count;
                break;
            case 'pizza-count':
                element.textContent = lang.pizza_count;
                break;
            case 'avg-time':
                element.textContent = lang.avg_time;
                break;
            case 'total-sales':
                element.textContent = lang.total_sales;
                break;
            case 'feedback-count':
                element.textContent = lang.feedback_count;
                break;
            case 'high-quality':
                element.textContent = lang.high_quality;
                break;
            case 'medium-quality':
                element.textContent = lang.medium_quality;
                break;
            case 'low-quality':
                element.textContent = lang.low_quality;
                break;
        }
    });

    // 更新筛选器标签
    document.querySelector('#delivery-area').previousElementSibling.textContent = lang.area;
    document.querySelector('#order-type').previousElementSibling.textContent = lang.order_type;

    // 更新下拉选项
    updateSelectOptions('delivery-area', [
        {value: 'All', text: lang.all},
        {value: 'Boston', text: lang.boston},
        {value: 'Cambridge', text: lang.cambridge},
        {value: 'Somerville', text: lang.somerville}
    ]);

    updateSelectOptions('order-type', [
        {value: 'All', text: lang.all},
        {value: 'web', text: lang.web},
        {value: 'phone', text: lang.phone}
    ]);
}

// 更新下拉选项辅助函数
function updateSelectOptions(selectId, options) {
    const select = document.getElementById(selectId);
    const value = select.value; // 保存当前选中值

    select.innerHTML = options.map(opt =>
        `<option value="${opt.value}">${opt.text}</option>`
    ).join('');

    select.value = value; // 恢复选中值
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initialize);
