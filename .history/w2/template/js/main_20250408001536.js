// DATASETS

// Global variable with 1198 pizza deliveries
//console.log(deliveryData);

// Global variable with 200 customer feedbacks
//console.log(feedbackData);

// 当前语言变量
let currentLang = 'zh';
let filteredData = [];

// 初始化函数
function initialize() {
    try {
        // 确保数据加载
        if (!deliveryData || !feedbackData) {
            console.error('数据未正确加载');
            return;
        }

        // 初始化数据
        filteredData = [...deliveryData];

        // 确保 DOM 完全加载后再更新语言，否则图表
        if (document.readyState === 'complete') {
            updateLanguage();
            updateStats();
            renderBarChart(filteredData);
        } else {
            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'complete') {
                    updateLanguage();
                    updateStats();
                    renderBarChart(filteredData);
                }
            });
        }
    } catch (error) {
        console.error('初始化错误:', error);
    }
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
    try {
        currentLang = document.getElementById('language-select').value;
        updateLanguage();
        updateStats();
    } catch (error) {
        console.error('语言切换错误:', error);
    }
}

// 更新页面文本
function updateLanguage() {
    try {
        const lang = languages[currentLang];
        if (!lang) {
            console.error('未找到语言配置:', currentLang);
            return;
        }

        // 使用 querySelector 查找元素并添加错误检查
        const title = document.querySelector('h1');
        if (title) title.textContent = lang.title;

        // 更新统计标题
        const statBoxes = {
            'delivery-count': lang.delivery_count,
            'pizza-count': lang.pizza_count,
            'avg-time': lang.avg_time,
            'total-sales': lang.total_sales,
            'feedback-count': lang.feedback_count,
            'high-quality': lang.high_quality,
            'medium-quality': lang.medium_quality,
            'low-quality': lang.low_quality
        };

        Object.entries(statBoxes).forEach(([id, text]) => {
            const element = document.querySelector(`#${id}`);
            if (element) {
                const titleElement = element.previousElementSibling;
                if (titleElement) titleElement.textContent = text;
            }
        });

        // 更新筛选器标签
        const areaLabel = document.querySelector('#delivery-area')?.previousElementSibling;
        if (areaLabel) areaLabel.textContent = lang.area;

        const typeLabel = document.querySelector('#order-type')?.previousElementSibling;
        if (typeLabel) typeLabel.textContent = lang.order_type;

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
    } catch (error) {
        console.error('更新语言错误:', error);
    }
}

// 更新下拉选项辅助函数
function updateSelectOptions(selectId, options) {
    try {
        const select = document.getElementById(selectId);
        if (!select) {
            console.error('未找到选择器元素:', selectId);
            return;
        }

        const currentValue = select.value;
        select.innerHTML = options.map(opt =>
            `<option value="${opt.value}">${opt.text}</option>`
        ).join('');
        select.value = currentValue;
    } catch (error) {
        console.error('更新选项错误:', error);
    }
}

// 仅在 DOM 完全加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
