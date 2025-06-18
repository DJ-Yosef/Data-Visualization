d3.csv("buildings.csv").then(function(data) {
    // 处理CSV数据
    const buildingsData = data.map(d => ({
        name: d.building,
        height_m: +d.height_m,
        height_ft: +d.height_ft,
        height_px: +d.height_px,
        country: d.country,
        city: d.city,
        floors: +d.floors,
        year: +d.completed,
        image: `img/${d.image}`
    }));

    // 按高度排序并取前10个
    buildingsData.sort((a, b) => b.height_m - a.height_m);
    const top10Buildings = buildingsData.slice(0, 10);

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
        .domain(top10Buildings.map(d => d.name))
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
        .data(top10Buildings)
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
        .data(top10Buildings)
        .enter()
        .append("text")
        .attr("class", "height-label")
        .attr("x", d => d.height_px + 5)
        .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
        .text(d => `${d.height_m}米`);

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
        document.getElementById("height-value").textContent = `${building.height_m} 米`;
        document.getElementById("city-value").textContent = building.city;
        document.getElementById("country-value").textContent = building.country;
        document.getElementById("floors-value").textContent = building.floors;
        document.getElementById("year-value").textContent = building.year;

        // 设置图片
        const img = document.getElementById("building-image");
        img.src = building.image;
        img.alt = building.name;
        img.title = building.name;
    }

    // 默认选择第一个建筑
    if (top10Buildings.length > 0) {
        showBuildingDetails(top10Buildings[0]);
    }
}).catch(function(error) {
    // 错误处理
    console.error("加载CSV数据时出错:", error);
    d3.select("#chart")
        .append("div")
        .style("color", "red")
        .style("padding", "20px")
        .html("<h3>数据加载失败</h3><p>请检查CSV文件路径是否正确</p>");
});