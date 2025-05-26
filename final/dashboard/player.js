// player.js
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const playerName = params.get('name');

    const data = await d3.json('player_data.json');
    const player = data.find(p => p.player === decodeURIComponent(playerName));

    if (player) {
        renderPlayerInfo(player);
        drawRadarChart(player);
    }
});

function renderPlayerInfo(player) {
    // 基础信息
    document.getElementById('player-img').src = player.player_img;
    document.getElementById('player-name').textContent = player.player;
    document.getElementById('player-pos').textContent = player.pos;
    document.getElementById('player-age').textContent = player.Age;
    document.getElementById('player-height').textContent = `${player.height}cm`;
    document.getElementById('player-team').textContent = player.squad;

    // 核心指标
    document.getElementById('gls90').textContent = (player.Gls / player['90s']).toFixed(1);
    document.getElementById('xG').textContent = player.xG.toFixed(1);
    document.getElementById('prgC').textContent = player.PrgC;

    // 详细数据
    document.getElementById('MP').textContent = player.MP;
    document.getElementById('Poss').textContent = `${player.Poss}%`;
    document.getElementById('G-PK').textContent = player['G-PK'];
}

function drawRadarChart(player) {
    // 雷达图指标计算
    const metrics = {
        stamina: calculateStamina(player),
        shooting: calculateShooting(player),
        control: calculateControl(player),
        passing: calculatePassing(player),
        defense: calculateDefense(player),
        special: calculateSpecial(player)
    };

    // 标准化到0-100
    const normalized = normalizeMetrics(metrics);

    // D3雷达图绘制
    const radarData = [{
        axes: Object.entries(normalized).map(([key, value]) => ({
            axis: translateLabel(key),
            value: value
        }))
    }];

    RadarChart.draw("#radar-chart", radarData, radarConfig);
}

// 指标计算函数
function calculateStamina(p) {
    return (p.Min / 90) * 30 + (p['90s'] / p.MP) * 70;
}

function calculateShooting(p) {
    return (p.Gls * 40) + (p.xG * 30) + (p['G-PK'] * 30);
}

function calculateControl(p) {
    return (p.PrgC * 0.6 + p.Poss * 0.4) * 1.5;
}

function calculatePassing(p) {
    return (p.PrgP * 0.5 + p.Ast * 0.3 + p.xAG * 0.2) * 2;
}

function calculateDefense(p) {
    return (100 - p.CrdY * 2) - p.CrdR * 5;
}

function calculateSpecial(p) {
    return (p.npxG + p.xAG) * 10;
}

// 归一化函数
function normalizeMetrics(metrics) {
    const ranges = {
        stamina: [50, 100],
        shooting: [30, 95],
        control: [40, 90],
        passing: [45, 85],
        defense: [60, 98],
        special: [50, 95]
    };

    return Object.fromEntries(
        Object.entries(metrics).map(([k, v]) => [
            k,
            ((v - ranges[k][0]) / (ranges[k][1] - ranges[k][0])) * 100]
        )
    );
}

// 雷达图配置
const radarConfig = {
    w: 400,
    h: 400,
    margin: {top: 50, right: 50, bottom: 50, left: 50},
    maxValue: 100,
    levels: 5,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(["#3498db"]),
    format: d3.format(".0f"),
    legend: false
};

// 中英对照
function translateLabel(label) {
    const translations = {
        stamina: '体能',
        shooting: '射门',
        control: '控球',
        passing: '传球',
        defense: '防守',
        special: '创造'
    };
    return translations[label] || label;
}