var formatTime = d3.timeFormat("%d-%b-%y");
let now = new Date();
var balance=10000
var income=12000
var totalexp=5000
var goal=100000
var percent=0.1
var data=[]

while(goal>0){
    data.push({"date":formatTime(now),"goal":goal})
    balance+=income-totalexp
    if ((percent*balance)>goal){
        goal=0
    }
    else{
        goal-=percent*balance
    }
    now.setMonth(now.getMonth() + 1);
}

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the area
var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.goal); });

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.goal); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
data.forEach(function (d) {
    d.date = d.date;
    d.goal = +d.goal;
});

// scale the range of the data
x.domain(d3.extent(data, function (d) {
    return d.date;
}));
console.log(x)
y.domain([0, d3.max(data, function (d) {
    return d.goal;
})]);

// add the area
svg.append("path")
    .data([data])
    .attr("class", "area")
    .attr("d", area);

// add the valueline path.
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

// add the X Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y));