// 建筑数据
const buildingsData = [
    {
        name: "哈利法塔",
        height_m: 828,
        height_px: 500,
        city: "迪拜",
        country: "阿联酋",
        floors: 163,
        year: 2010,
        image: "burj_khalifa.jpg"
    },
    {
        name: "默迪卡118",
        height: 679,
        height_px: 410,
        city: "吉隆坡",
        country: "马来西亚",
        floors: 118,
        year: 2023,
        image: "merdeka_118.jpg"
    },
    {
        name: "上海中心大厦",
        height: 632,
        height_px: 382,
        city: "上海",
        country: "中国",
        floors: 128,
        year: 2015,
        image: "shanghai_tower.jpg"
    },
    {
        name: "麦加皇家钟塔饭店",
        height: 601,
        height_px: 363,
        city: "麦加",
        country: "沙特阿拉伯",
        floors: 120,
        year: 2012,
        image: "makkah_royal.jpg"
    },
    {
        name: "平安国际金融中心",
        height: 599,
        height_px: 362,
        city: "深圳",
        country: "中国",
        floors: 115,
        year: 2017,
        image: "ping_an.jpg"
    },
    {
        name: "乐天世界大厦",
        height: 555,
        height_px: 335,
        city: "首尔",
        country: "韩国",
        floors: 123,
        year: 2017,
        image: "lotte_world.jpg"
    },
    {
        name: "加拿大国家电视塔",
        height: 553,
        height_px: 334,
        city: "多伦多",
        country: "加拿大",
        floors: 7,
        year: 1976,
        image: "cn_tower.jpg"
    },
    {
        name: "世界贸易中心一号大楼",
        height: 541,
        height_px: 327,
        city: "纽约",
        country: "美国",
        floors: 94,
        year: 2014,
        image: "one_wtc.jpg"
    },
    {
        name: "广州周大福金融中心",
        height: 530,
        height_px: 320,
        city: "广州",
        country: "中国",
        floors: 111,
        year: 2016,
        image: "guangzhou_ctf.jpg"
    },
    {
        name: "天津周大福金融中心",
        height: 530,
        height_px: 320,
        city: "天津",
        country: "中国",
        floors: 97,
        year: 2019,
        image: "tianjin_ctf.jpg"
    }
];

// 按高度排序
buildingsData.sort((a, b) => b.height - a.height);

// 设置图表尺寸
const margin = { top: 40, right: 20, bottom: 60, left: 200 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// 创建SVG容器
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 添加渐变
const defs = svg.append("defs");
const gradient = defs.append("linearGradient")
    .attr("id", "barGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#00c6ff");

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#0072ff");

// 创建Y轴比例尺
const yScale = d3.scaleBand()
    .domain(buildingsData.map(d => d.name))
    .range([0, height])
    .padding(0.2);

// 添加Y轴
svg.append("g")
    .call(d3.axisLeft(yScale).tickSize(0))
    .attr("class", "axis-label")
    .selectAll("text")
    .attr("class", "bar-label")
    .attr("dx", "-10px")
    .on("click", function(event, d) {
        showBuildingDetails(d);
    });

// 添加柱状图
svg.selectAll(".bar")
    .data(buildingsData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => yScale(d.name))
    .attr("x", 0)
    .attr("height", yScale.bandwidth())
    .attr("width", d => d.height_px)
    .on("click", function(event, d) {
        showBuildingDetails(d);
    });

// 添加高度标签
svg.selectAll(".height-label")
    .data(buildingsData)
    .enter()
    .append("text")
    .attr("class", "height-label")
    .attr("x", d => d.height_px + 5)
    .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
    .text(d => `${d.height}米`);

// 添加图例
svg.append("text")
    .attr("x", width)
    .attr("y", height + 40)
    .attr("class", "legend")
    .attr("text-anchor", "end")
    .text("建筑高度（米）");

// 添加标题
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("class", "legend")
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("世界十大最高建筑");

// 显示建筑详细信息
function showBuildingDetails(building) {
    // 更新选中状态
    d3.selectAll(".bar").classed("selected", false);
    d3.selectAll(".bar")
        .filter(d => d.name === building.name)
        .classed("selected", true);

    // 更新右侧面板
    document.getElementById("building-name").textContent = building.name;
    document.getElementById("building-location").textContent = `${building.city}, ${building.country}`;
    document.getElementById("height-value").textContent = `${building.height} 米`;
    document.getElementById("city-value").textContent = building.city;
    document.getElementById("country-value").textContent = building.country;
    document.getElementById("floors-value").textContent = building.floors;
    document.getElementById("year-value").textContent = building.year;

    // 设置图片（模拟路径）
    const img = document.getElementById("building-image");
    img.alt = building.name;
    img.title = building.name;

    // 在实际应用中，这里应该使用真实图片路径
    img.style.background = `linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c)`;
    img.innerHTML = `<div style="text-align:center; padding:20px;">
        <h3>${building.name}</h3>
        <p>${building.city}, ${building.country}</p>
        <p>高度: ${building.height}米 | 楼层: ${building.floors}</p>
        <p>竣工年份: ${building.year}</p>
    </div>`;
}

// 默认选择第一个建筑
showBuildingDetails(buildingsData[0]);