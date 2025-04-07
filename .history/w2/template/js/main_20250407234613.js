// DATASETS

// Global variable with 1198 pizza deliveries
//console.log(deliveryData);

// Global variable with 200 customer feedbacks
//console.log(feedbackData);

// 全局变量储存过滤后的数据
let filteredData = [];

// 初始化函数
function initialize() {
    // 复制原始数据
    filteredData = [...deliveryData];
    // 更新统计数据和图表
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

    // 更新统计和图表
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initialize);
