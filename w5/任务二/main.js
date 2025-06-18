// 加载人口数据
d3.csv("zaatari-refugee-camp-population.csv").then(data => {
    // 转换日期格式
    data.forEach(d => {
        d.date = d3.timeParse("%Y/%m/%d")(d.date);
        d.population = +d.population;
    });

    // 创建面积图
    createAreaChart(data);
});

// 庇护所类型数据
const shelterData = [
    { type: "Caravans", percentage: 79.68 },
    { type: "Combination*", percentage: 10.81 },
    { type: "Tents", percentage: 9.51 }
];

// 创建柱状图
createBarChart(shelterData);

function createAreaChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
          width = 600 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#population-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 定义比例尺
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)])
        .range([height, 0]);

    // 绘制面积
    const area = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.population))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "#8c564b");

    // 添加坐标轴
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -40)
        .attr("dominant-baseline", "center")
        .text("Population");

    svg.append("g")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")))
        .attr("transform", `translate(0,${height})`)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-60)");

    // 添加标题
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Camp Population");

    // 添加提示框
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 0)
        .on("mouseover", function(event, d) {
            tooltip
                .style("left", event.pageX + "px")
                .style("top", event.pageY - 28 + "px")
                .html(`<strong>${d3.timeFormat("%Y-%m-%d")(d.date)}</strong><br/>Population: <b>${d.population.toLocaleString()}</b>`)
                .attr("class", "visible");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });
}

function createBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
          width = 600 - margin.left - margin.right,
          height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#shelter-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 定义比例尺
    const x = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // 绘制柱状图
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.type))
        .attr("y", d => y(d.percentage))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.percentage))
        .style("fill", "#8c564b");

    // 添加类别名称
    svg.selectAll(".bar")
        .data(data)
        .enter().append("text")
        .attr("x", d => x(d.type) + x.bandwidth() / 2)
        .attr("y", d => y(d.percentage) - 20)
        .text(d => d.type)
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "14px")
        .attr("fill", "#fff");

    // 添加百分比标签
    svg.selectAll(".percentage-label")
        .data(data)
        .enter().append("text")
        .attr("x", d => x(d.type) + x.bandwidth() / 2)
        .attr("y", d => y(d.percentage) - 10)
        .text(d => `Percentage:<br>${d.percentage.toFixed(2)}%`)
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "12px");

    // 添加坐标轴
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -40)
        .attr("dominant-baseline", "center")
        .text("Percentage");

    svg.append("g")
        .call(d3.axisBottom(x));

    // 添加标题
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Type of Shelter");
}
