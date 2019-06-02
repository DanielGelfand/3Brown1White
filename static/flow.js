var units = "Dollars";
var idnum=document.getElementById("id")
var monthly=[]
var daily=[]
d3.csv("static/finance.csv").then(function(data) {

}) 
// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// format variables
var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the body of the page
var svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.link();
// load the data
d3.csv("static/finance.csv").then(function(data) {
  var income=0
  var balance=0
  for (let i = 0; i< data.length; i++) {
    console.log(data[i]["id"])
    if (parseInt(data[i]["id"])==parseInt(idnum.innerHTML)){
        income=data[i]["income"]
        balance=data[i]["balance"]
        var dailies=data[i]["daily"].substring(1,data[i]["daily"].length-1).split(" ")
        var dailysum=0
        for (let j = 0; j< dailies.length; j+=2) {
          // I split each of the daily costs for a certain person and that splitting causes space issues so I need to take substrings to parse the data
          var val=parseInt(dailies[j+1].substring(1,dailies[j+1].length))
          daily.push({"name":dailies[j].substring(1,dailies[j].length-2),"value":val*30})
          dailysum+=val*30
        }
        daily.push({"name":"daily","value":dailysum})
        var monthlysum=0
        var monthlies=data[i]["monthly"].substring(1,data[i]["monthly"].length-1).split(" ")
        for (let j = 0; j< monthlies.length; j+=2) {
          // I split each of the daily costs for a certain person and that splitting causes space issues so I need to take substrings to parse the data
          var val=parseInt(monthlies[j+1].substring(1,monthlies[j+1].length))
          monthly.push({"name":monthlies[j].substring(1,monthlies[j].length-2),"value":val})
          monthlysum+=val
        }
        monthly.push({"name":"monthly","value":monthlysum})
    }
  }
  //set up graph in same style as original example but empty
  graph = {"nodes" : [], "links" : []};

  for (const key in data[0]) {
      if (data[0].hasOwnProperty(key)) {
          if(key!="id"){
            console.log(key)
            graph.nodes.push({ "name": key});
          }
      }
  }
  daily.forEach(el => {
    if(el.name!="daily"){
      graph.nodes.push({ "name": el.name});
      graph.links.push({"source":"daily","target":el.name,"value":+el.value})
    }
  });
  monthly.forEach(el => {
    if(el.name!="monthly"){
      graph.nodes.push({ "name": el.name});
      graph.links.push({"source":"monthly","target":el.name,"value":+el.value})
    }
  });
  graph.nodes.push({"name":"Unable to Pay/ Loan"})
  
  console.log(monthly[monthly.length-1].value)
  if(income>=monthly[monthly.length-1].value){
    var inleft=0
    graph.links.push({"source":"income","target":"monthly","value":+monthly[monthly.length-1].value})
    inleft=income-monthly[monthly.length-1].value
    if(inleft>=daily[daily.length-1].value){
      graph.links.push({"source":"income","target":"daily","value":+daily[daily.length-1].value})
    }
    else if(balance>=daily[daily.length-1].value-inleft){
      var remaining=0
      graph.links.push({"source":"income","target":"daily","value":+inleft})
      remaining=daily[daily.length-1].value-inleft
      graph.links.push({"source":"balance","target":"daily","value":+remaining})
    }
    else{
      var remaining=0
      graph.links.push({"source":"income","target":"daily","value":+inleft})
      graph.links.push({"source":"balance","target":"daily","value":+balance})
      remaining=daily[daily.length-1].value-inleft-balance
      graph.links.push({"source":"Unable to Pay/ Loan","target":"daily","value":+remaining})
    }
  }
  else if(balance>=monthly[monthly.length-1].value-income){
    var baleft=0
    graph.links.push({"source":"income","target":"monthly","value":+income})
    baleft=monthly[monthly.length-1].value-income
    graph.links.push({"source":"balance","target":"monthly","value":+baleft})
    if(balance>=daily[daily.length-1].value){
      graph.links.push({"source":"balance","target":"daily","value":+baleft})
    }
    else{
      var remaining=0
      graph.links.push({"source":"balance","target":"daily","value":+baleft})
      remaining=daily[daily.length-1].value-baleft
      graph.links.push({"source":"Unable to Pay/ Loan","target":"daily","value":+remaining})
    }
  }
  else{
    graph.links.push({"source":"Unable to Pay/ Loan","target":"monthly","value":+monthly[monthly.length-1].value})
    graph.links.push({"source":"Unable to Pay/ Loan","target":"daily","value":+daily[daily.length-1].value})
  }
  console.log(graph.nodes)
  var checklinks=function(node){
    var notin=false
    graph["links"].forEach(element => {
      if(node==element["source"] || node==element["target"]){
        notin=true
      }
    });
    return notin;
  }
  var toremove=[]
  for (let i = 0; i < graph["nodes"].length; i++) {
    if(!(checklinks(graph["nodes"][i]["name"]))){
      console.log(graph["nodes"][i]["name"])
      toremove.push(graph["nodes"][i]["name"])
    }
  }
  toremove.forEach(el => {
    graph.nodes=graph["nodes"].filter(function(value, index, arr){return value.name != el;});
  });
  console.log(graph)
  //return only the distinct / unique nodes
  graph.nodes = d3.keys(d3.nest()
    .key(function (d) { return d.name; })
    .object(graph.nodes));

  // loop through each link replacing the text with its index from node
  graph.links.forEach(function (d, i) {
    graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
  });
  // now loop through each nodes to make nodes an array of objects
  // rather than an array of strings
  graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { "name": d };
  });

  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

  // add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

  // add the link titles
  link.append("title")
        .text(function(d) {
    		return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

  // add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
        .subject(function(d) {
          return d;
        })
        .on("start", function() {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

  // add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { 
		  return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { 
		  return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { 
		  return d.name + "\n" + format(d.value); });

  // add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this)
      .attr("transform", 
            "translate(" 
               + d.x + "," 
               + (d.y = Math.max(
                  0, Math.min(height - d.dy, d3.event.y))
                 ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
});