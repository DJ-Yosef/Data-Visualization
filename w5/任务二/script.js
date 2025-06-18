// script.js

const margin = { top: 60, right: 30, bottom: 80, left: 60 };

// 面积图尺寸
const areaChartWidth = 500 - margin.left - margin.right;
const areaChartHeight = 400 - margin.top - margin.bottom;

// 柱状图尺寸
const barChartWidth = 400 - margin.left - margin.right;
const barChartHeight = 400 - margin.top - margin.bottom;


// 创建 SVG
const svgArea = d3.select("#area-chart-container")
    .append("svg")
    .attr("width", areaChartWidth + margin.left + margin.right)
    .attr("height", areaChartHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const svgBar = d3.select("#bar-chart-container")
    .append("svg")
    .attr("width", barChartWidth + margin.left + margin.right)
    .attr("height", barChartHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// 创建一个日期解析器
const parseDate = d3.timeParse("%Y/%m/%d");

d3.csv("zaatari-refugee-camp-population.csv").then(data => {
    // 转换数据格式
    data.forEach(d => {
        d.date = parseDate(d.date); // 将日期字符串转换为日期对象
        d.population = +d.population; // 将人口数转换为数字
    });

    // 确保数据按日期排序
    data.sort((a, b) => a.date - b.date);

    console.log("处理后的面积图数据:", data); // 检查日期是否正确解析
    drawAreaChart(data);
}).catch(error => {
    console.error("加载或处理人口数据时出错:", error);
});

function drawAreaChart(data) {
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, areaChartWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population) * 1.05]) // 从0开始，顶部留出一些空间
        .range([areaChartHeight, 0]);

    // 创建面积生成器
    const area = d3.area()
        .x(d => xScale(d.date))
        .y0(areaChartHeight) // 面积图的底部从Y轴的底部开始
        .y1(d => yScale(d.population)); // 面积图的顶部根据人口数据变化

    // 绘制面积图
    svgArea.append("path")
        .datum(data)
        .attr("fill", "steelblue") // 填充颜色
        .attr("opacity", 0.7) // 透明度
        .attr("d", area);


    // 创建提示条 div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // 添加一个覆盖层，用于捕获鼠标事件
    svgArea.append("rect")
        .attr("class", "overlay")
        .attr("width", areaChartWidth)
        .attr("height", areaChartHeight)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { tooltip.style("opacity", 1); })
        .on("mouseout", function() { tooltip.style("opacity", 0); })
        .on("mousemove", mousemove);

    function mousemove(event) {
        const x0 = xScale.invert(d3.pointer(event)[0]);
        // 找到最接近鼠标日期的那个数据点
        const bisectDate = d3.bisector(d => d.date).left;
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        tooltip.html(`日期: ${d3.timeFormat("%Y年%m月%d日")(d.date)}<br>人口: ${d.population.toLocaleString()}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    // 添加轴和标题
    svgArea.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${areaChartHeight})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeMonth.every(3)))
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svgArea.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    svgArea.append("text")
        .attr("transform", `translate(${areaChartWidth / 2}, ${areaChartHeight + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("日期");

    svgArea.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (areaChartHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("人口数量");

    svgArea.append("text")
        .attr("x", areaChartWidth / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("扎阿塔里难民营人口数量变化");
}


const shelterData = [
    { type: "大篷车", percentage: 79.68 },
    { type: "帐篷和大篷车", percentage: 10.81 },
    { type: "仅帐篷", percentage: 9.51 }
];

drawBarChart(shelterData);


function drawBarChart(data) {
    const xScaleBar = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, barChartWidth])
        .padding(0.3);
    const yScaleBar = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.percentage) * 1.1]) // 百分比，顶部留出一些空间
        .range([barChartHeight, 0]);

    svgBar.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScaleBar(d.type))
        .attr("y", d => yScaleBar(d.percentage))
        .attr("width", xScaleBar.bandwidth())
        .attr("height", d => barChartHeight - yScaleBar(d.percentage))
        .attr("fill", "olivedrab");

    svgBar.append("g")
        .attr("class", "x-axis-bar")
        .attr("transform", `translate(0,${barChartHeight})`)
        .call(d3.axisBottom(xScaleBar));

    svgBar.append("g")
        .attr("class", "y-axis-bar")
        .call(d3.axisLeft(yScaleBar).tickFormat(d => d + "%")); // Y轴显示百分比

    svgBar.append("text")
        .attr("transform", `translate(${barChartWidth / 2}, ${barChartHeight + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("庇护所类型");

    svgBar.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (barChartHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("居住家庭百分比");

    svgBar.append("text")
        .attr("x", barChartWidth / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("扎阿塔里难民营庇护所类型分布");
}