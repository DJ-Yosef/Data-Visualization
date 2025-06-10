// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 状态管理
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamData, setTeamData] = useState(null);

  // 模拟数据加载（实际应从后端API获取）
  useEffect(() => {
    // 模拟球队数据
    setTeams([
      { id: 1, name: '皇家马德里', league: '西甲' },
      { id: 2, name: '巴塞罗那', league: '西甲' },
      { id: 3, name: '曼联', league: '英超' },
      { id: 4, name: '拜仁慕尼黑', league: '德甲' }
    ]);

    // 模拟球员数据
    setPlayers([
      {
        id: 101,
        name: 'Cristiano Ronaldo',
        country: '葡萄牙',
        team: '曼联',
        position: '前锋',
        age: 37,
        height: 187,
        avatar: 'https://placehold.co/150x150?text=C.Ronaldo ',
        stats: {
          stamina: 85,
          shooting: 92,
          dribbling: 88,
          passing: 80,
          defending: 65
        },
        coordinates: [
          { x: 80, y: 34 }, { x: 75, y: 40 }, { x: 70, y: 45 },
          { x: 65, y: 50 }, { x: 60, y: 55 }, { x: 55, y: 60 }
        ]
      },
      {
        id: 102,
        name: 'Lionel Messi',
        country: '阿根廷',
        team: '巴黎圣日耳曼',
        position: '前锋',
        age: 35,
        height: 170,
        avatar: 'https://placehold.co/150x150?text=Messi ',
        stats: {
          stamina: 78,
          shooting: 95,
          dribbling: 98,
          passing: 92,
          defending: 58
        },
        coordinates: [
          { x: 20, y: 10 }, { x: 25, y: 15 }, { x: 30, y: 20 },
          { x: 35, y: 25 }, { x: 40, y: 30 }, { x: 45, y: 35 }
        ]
      }
    ]);
  }, []);

  // 球队选择处理
  const handleTeamSelect = (e) => {
    const teamId = parseInt(e.target.value);
    const selected = teams.find(team => team.id === teamId);
    setSelectedTeam(selected);

    // 模拟加载球队数据
    setTeamData({
      name: selected.name,
      league: selected.league,
      founded: 1902,
      stadium: selected.name === '曼联' ? '老特拉福德' :
              selected.name === '皇马' ? '伯纳乌' : '诺坎普',
      value: selected.name === '曼联' ? '8.5亿欧元' : '7.2亿欧元',
      players: 25,
      avgAge: selected.name === '曼联' ? 26.5 : 27.1
    });
  };

  // 球员选择处理
  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 头部 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-700">足球运动员数据分析平台</h1>
      </header>

      {/* 主体布局 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：球队选择栏 */}
        <div className="col-span-12 md:col-span-3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">球队选择</h2>
          <select
            onChange={handleTeamSelect}
            className="w-full p-2 border rounded"
          >
            <option value="">请选择球队</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.league})
              </option>
            ))}
          </select>

          {/* 球队信息栏 */}
          {teamData && (
            <div className="mt-6 p-4 bg-blue-50 rounded">
              <h3 className="font-bold text-lg">{teamData.name}</h3>
              <p>联赛：{teamData.league}</p>
              <p>成立时间：{teamData.founded}</p>
              <p>主场：{teamData.stadium}</p>
              <p>球队身价：{teamData.value}</p>
              <p>球员人数：{teamData.players}</p>
              <p>平均年龄：{teamData.avgAge}岁</p>
            </div>
          )}
        </div>

        {/* 中间：球场仪表盘 */}
        <div className="col-span-12 md:col-span-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">球场仪表盘</h2>
          <div className="relative h-96 bg-green-600 rounded overflow-hidden">
            {/* 模拟足球场 */}
            <div className="absolute inset-0 p-4">
              {/* 足球场边线 */}
              <svg className="w-full h-full" viewBox="0 0 100 68">
                {/* 足球场轮廓 */}
                <rect x="0" y="0" width="100" height="68" fill="none" stroke="white" strokeWidth="0.5"/>
                {/* 中圈 */}
                <circle cx="50" cy="34" r="9" fill="none" stroke="white" strokeWidth="0.3"/>
                {/* 半场线 */}
                <line x1="50" y1="0" x2="50" y2="68" stroke="white" strokeWidth="0.3"/>
                {/* 球门区域 */}
                <rect x="0" y="24" width="10" height="20" fill="none" stroke="white" strokeWidth="0.3"/>
                <rect x="90" y="24" width="10" height="20" fill="none" stroke="white" strokeWidth="0.3"/>
              </svg>

              {/* 球员热力图 */}
              {selectedPlayer && selectedPlayer.coordinates && (
                <svg className="absolute top-0 left-0 w-full h-full">
                  {selectedPlayer.coordinates.map((coord, i) => (
                    <circle
                      key={i}
                      cx={`${coord.x}%`}
                      cy={`${coord.y}%`}
                      r="1.5"
                      fill="rgba(255,255,255,0.8)"
                      className="animate-pulse"
                    />
                  ))}
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：球员信息栏 */}
        <div className="col-span-12 md:col-span-3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">球员信息</h2>

          {players.map(player => (
            <div
              key={player.id}
              className={`mb-4 p-3 rounded cursor-pointer transition ${
                selectedPlayer?.id === player.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => handlePlayerSelect(player)}
            >
              <div className="flex items-center">
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium">{player.name}</h3>
                  <p className="text-sm text-gray-600">{player.position}</p>
                </div>
              </div>
            </div>
          ))}

          {/* 球员详细信息 */}
          {selectedPlayer && (
            <div className="mt-6">
              <h3 className="font-bold text-lg">{selectedPlayer.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>国籍：{selectedPlayer.country}</p>
                <p>球队：{selectedPlayer.team}</p>
                <p>位置：{selectedPlayer.position}</p>
                <p>年龄：{selectedPlayer.age}岁</p>
                <p>身高：{selectedPlayer.height}cm</p>
              </div>

              {/* 雷达图 */}
              <div className="mt-6">
                <RadarChart data={selectedPlayer.stats} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 雷达图组件
function RadarChart({ data }) {
  // 计算雷达图数据
  const keys = Object.keys(data);
  const values = Object.values(data);
  const maxValue = Math.max(...values) * 1.1;

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {/* 雷达网格 */}
      {[1, 2, 3, 4, 5].map(i => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={i * 20}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      ))}

      {/* 雷达轴线 */}
      {keys.map((key, i) => {
        const angle = (Math.PI * 2 * i) / keys.length;
        const x = 100 + 100 * Math.cos(angle);
        const y = 100 + 100 * Math.sin(angle);
        return (
          <line
            key={key}
            x1="100"
            y1="100"
            x2={x}
            y2={y}
            stroke="#ccc"
            strokeWidth="0.5"
          />
        );
      })}

      {/* 雷达区域 */}
      <polygon
        points={keys.map((key, i) => {
          const angle = (Math.PI * 2 * i) / keys.length;
          const radius = (data[key] / maxValue) * 100;
          return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`
        }).join(' ')}
        fill="rgba(0, 123, 255, 0.3)"
        stroke="#007bff"
        strokeWidth="2"
      />

      {/* 标签 */}
      {keys.map((key, i) => {
        const angle = (Math.PI * 2 * i) / keys.length;
        const x = 100 + 110 * Math.cos(angle);
        const y = 100 + 110 * Math.sin(angle);
        return (
          <text
            key={key}
            x={x}
            y={y}
            fontSize="10"
            textAnchor="middle"
            fill="#333"
          >
            {key}
          </text>
        );
      })}
    </svg>
  );
}

export default App;