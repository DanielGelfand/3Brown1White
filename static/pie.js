var units = "Dollars";
var idnum = document.getElementById("id")
var monthly = []
var daily = []
var inputs=document.getElementsByTagName("input")
var width = 450
    height = 450
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// create 2 data_set
var data1 = {a: 9, b: 20, c:30, d:8, e:12}
var data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f"])
  .range(d3.schemeDark2);
d3.csv("static/finance.csv").then(function (dat) {
  var monthlysum = 0
  var dailysum = 0
  for (let i = 0; i < dat.length; i++) {
    if (parseInt(dat[i]["id"]) == parseInt(idnum.innerHTML)) {
      income = dat[i]["income"]
      balance = dat[i]["balance"]
      var dailies = dat[i]["daily"].substring(1, dat[i]["daily"].length - 1).split(" ")
      var dailysum = 0
      for (let j = 0; j < dailies.length; j += 2) {
        // I split each of the daily costs for a certain person and that splitting causes space issues so I need to take substrings to parse the data
        var val = parseFloat(dailies[j + 1].substring(1, dailies[j + 1].length))
        daily.push({
          "name": dailies[j].substring(1, dailies[j].length - 2),
          "value": val
        })
        dailysum += val
      }
      daily.push({
        "name": "daily",
        "value": dailysum
      })
      
      var monthlies = dat[i]["monthly"].substring(1, dat[i]["monthly"].length - 1).split(" ")
      for (let j = 0; j < monthlies.length; j += 2) {
        // I split each of the daily costs for a certain person and that splitting causes space issues so I need to take substrings to parse the data
        var val = parseFloat(monthlies[j + 1].substring(1, monthlies[j + 1].length))
        monthly.push({
          "name": monthlies[j].substring(1, monthlies[j].length - 2),
          "value": val
        })
        monthlysum += val
      }
      monthly.push({
        "name": "monthly",
        "value": monthlysum
      })
    }
  }

  var ddata=[]
  daily.forEach(el => {
    if (el.name != "daily") {
      ddata.push({
        "name": el.name,
        "percentage": (el.value / daily[daily.length - 1].value) * 100,
        "color": color(el.name)
      })
    }
  });
  var mdata=[]
  monthly.forEach(el => {
    if (el.name != "monthly") {
      mdata.push({
        "name": el.name,
        "percentage": (el.value / monthly[monthly.length - 1].value) * 100,
        "color": color(el.name)
      })
    }
  });
  var checked=function(){
    if (inputs["0"].checked){
      data=ddata
    }
    else{
      data=mdata
    }
  };
  checked()
  var arc=d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
  function update(data) {

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.percentage; })
      .sort(function(a, b) { return d3.ascending(a.name, b.name);} ) // This make sure that group order remains the same in the pie chart
    var data_ready = pie(data)
    function arcTween(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(1);
      return (t) => arc(i(t));
  }
    // map to data
    var u = svg.selectAll("path")
      .data(data_ready)

  u
    .transition()
    .duration(1000)
    .attrTween("d", arcTween)
    .attr('fill', function(d){ return(color(d.data.name)) })
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u
      .enter()
      .append('path')
      .transition()
      .duration(1000)
      .attr('d',arc 
      )
      .attr('fill', function(d){ return(color(d.data.name)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)
      .each(function(d) { this._current = d; });
     u
      .enter().append('text')
      .text(function name(d) {return d.data.name})
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)
      .attr("class","labels")



  
    // remove the group that is not present anymore
    u
      .exit()
      .remove()
  
  }
  function textUpdate(data){
    console.log(data)
    var pie = d3.pie()
      .value(function(d) {return d.percentage; })
      .sort(function(a, b) { return d3.ascending(a.name, b.name);} ) // This make sure that group order remains the same in the pie chart
    var data_ready = pie(data)
    var label=d3.selectAll(".labels")
    label.remove()
    data_ready.forEach(el => {
      console.log(el)
      svg.append("text")
      .text(el.data.name)
      .attr("transform", "translate(" + arc.centroid(el) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 17)
      .attr("class","labels")

      
    });
    
    

  }
  // Initialize the plot with the first dataset
  update(data)
  d3.selectAll("input").on("change",()=>{
    checked();
    textUpdate(data);
    update(data);
    })
})