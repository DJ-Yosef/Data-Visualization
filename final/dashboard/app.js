// app.js
document.addEventListener('DOMContentLoaded', () => {
    let allPlayers = [];

    // 加载数据
    d3.json('players_data.json').then(data => {
        allPlayers = preprocessData(data);
        initTeamSelector();
        setupEventListeners();
    });

    function preprocessData(players) {
        return players.map(p => ({
            ...p,
            position: getPositionCoords(p.pos),
            radarMetrics: calculateRadarMetrics(p)
        }));
    }

    function getPositionCoords(pos) {
        const positions = {
            'GK': {x: 10, y: 50},
            'CB': {x: 30, y: 50},
            'LB': {x: 20, y: 30},
            'RB': {x: 20, y: 70},
            'CM': {x: 50, y: 50},
            'LW': {x: 70, y: 30},
            'RW': {x: 70, y: 70},
            'ST': {x: 85, y: 50}
        };
        return positions[pos] || {x: 50, y: 50};
    }

    function calculateRadarMetrics(player) {
        return {
            aerial: (player.def_Blocks * 0.3 + player.def_Int * 0.7) / 2,
            passing: player.pas_Cmp * 0.8 + player.pas_PrgDist * 0.2,
            defense: player.def_Tkl * 0.6 + player.def_Int * 0.4,
            physical: (player.age / 40 * 100) + (player.height / 200 * 20),
            attack: player.sh_SoT * 0.7 + player.sh_xG * 0.3,
            special: player.pos_Succ * 2
        };
    }

    function initTeamSelector() {
        const teams = [...new Set(allPlayers.map(p => p.squad))];
        const selector = d3.select('#team-select');

        teams.forEach(team => {
            selector.append('option')
                .attr('value', team)
                .text(team);
        });
    }

    function setupEventListeners() {
        // 球队选择
        d3.select('#team-select').on('change', function() {
            const team = this.value;
            renderTeamPlayers(team);
        });

        // 关闭详情
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.getElementById('player-detail').classList.add('hidden');
        });
    }

    function renderTeamPlayers(team) {
        const container = d3.select('#player-markers');
        const players = allPlayers.filter(p => p.squad === team);

        container.selectAll('.player-marker')
            .data(players, d => d.player)
            .join(
                enter => enter.append('img')
                    .attr('class', 'player-marker')
                    .attr('src', d => d.player_img)
                    .style('left', d => `${d.position.x}%`)
                    .style('top', d => `${d.position.y}%`)
                    .on('click', (e, d) => {window.open(`player.html?name=${encodeURIComponent(d.player)}`, '_blank');}),
                update => update,
                exit => exit.remove()
            );
    }

    function showPlayerDetail(player) {
        const detailContainer = document.getElementById('player-detail');
        detailContainer.classList.remove('hidden');

        // 更新基本信息
        const header = `
            <img src="${player.player_img}" class="player-avatar">
            <div class="player-info">
                <h1>${player.player}</h1>
                <p>${player.age}岁 | ${player.height}cm</p>
                <div class="team-info">
                    <img src="${player.squad_img}" class="team-logo">
                    <span>${player.squad}</span>
                </div>
            </div>
        `;
        document.querySelector('.player-header').innerHTML = header;

        // 绘制雷达图
        drawRadarChart(player);

        // 更新统计数据
        const statsHtml = `
            <div class="stat-card">
                <h3>射门</h3>
                <p>${player.sh_SoT} 射正</p>
                <small>预期进球 ${player.sh_xG}</small>
            </div>
            <div class="stat-card">
                <h3>传球</h3>
                <p>${player.pas_Cmp} 成功</p>
                <small>成功率 ${player.pas_Cmp}%</small>
            </div>
            <div class="stat-card">
                <h3>防守</h3>
                <p>${player.def_Int} 拦截</p>
                <small>${player.def_Tkl} 抢断</small>
            </div>
        `;
        document.querySelector('.stats-grid').innerHTML = statsHtml;
    }

    function drawRadarChart(player) {
        const width = 400, height = 400;
        const radarContainer = d3.select('.radar-container').html('');

        const svg = radarContainer.append('svg')
            .attr('width', width)
            .attr('height', height);

        const axes = Object.keys(player.radarMetrics);
        const maxValues = {
            aerial: 100,
            passing: 100,
            defense: 100,
            physical: 100,
            attack: 100,
            special: 100
        };

        // 绘制雷达图轴
        axes.forEach((axis, i) => {
            const angle = (Math.PI * 2 * i) / axes.length;
            const x = width/2 + Math.cos(angle) * 180;
            const y = height/2 + Math.sin(angle) * 180;

            svg.append('line')
                .attr('x1', width/2)
                .attr('y1', height/2)
                .attr('x2', x)
                .attr('y2', y)
                .style('stroke', '#ddd');

            svg.append('text')
                .attr('x', x + Math.cos(angle)*10)
                .attr('y', y + Math.sin(angle)*10)
                .text(axis.toUpperCase())
                .style('font-size', '12px');
        });

        // 绘制数据多边形
        const points = axes.map((axis, i) => {
            const value = (player.radarMetrics[axis] / maxValues[axis]) * 180;
            const angle = (Math.PI * 2 * i) / axes.length;
            return [
                width/2 + Math.cos(angle) * value,
                height/2 + Math.sin(angle) * value
            ];
        });

        svg.append('polygon')
            .attr('points', points.join(' '))
            .style('fill', 'rgba(52, 152, 219, 0.3)')
            .style('stroke', '#3498db');
    }
});