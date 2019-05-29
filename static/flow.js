var units = "Dollars";
var idnum=document.getElementById("id")
console.log(idnum)
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
  var income=data[0]["income"]
  var balance=data[0]["balance"]
  //set up graph in same style as original example but empty
  graph = {"nodes" : [], "links" : []};
  var checklinks=function(node){
    var notin=false
    graph["links"].forEach(element => {
      if(node==element["source"] || node==element["target"]){
        notin=true
      }
    });
    return notin;
  }
  for (const key in data[0]) {
      if (data[0].hasOwnProperty(key)) {
          if(key!="id"){
          graph.nodes.push({ "name": key});
          }
      }
  }
  graph.nodes.push({"name":"Unable to Pay/ Loan"})
  for (const key in data[0]) {
    if (data[0].hasOwnProperty(key)) {
        if(key!="id" && key!="income" && key!="balance"){
          if(income>0){
            if(income-data[0][key]<0){
              var left=data[0][key]-income
              graph.links.push({ "source": "income",
              "target":key,
              "value":+income
              })
              income=0
              graph.links.push({ "source": "balance",
              "target":key,
              "value":+left
              })
              balance-=left
            }
            else{
              graph.links.push({ "source": "income",
              "target":key,
              "value":+data[0][key]
              })
              income-=data[0][key]
            }
          }
          else if(balance>0){
            if(balance-data[0][key]<0){
                var left=data[0][key]-balance
                graph.links.push({ "source": "balance",
                "target":key,
                "value":+balance
                })
                balance=0
                graph.links.push({ "source": "Unable to Pay/ Loan",
                "target":key,
                "value":+left
                })
            }
            else{
              graph.links.push({ "source": "balance",
              "target":key,
              "value":+data[0][key]
              })
              balance-=data[0][key]
            }
          }
          else{
            graph.links.push({ "source": "Unable to Pay/ Loan",
            "target":key,
            "value":+data[0][key]
            })
          }
      }
    }
  }
  var toremove=[]
  for (let i = 0; i < graph["nodes"].length; i++) {
    if(!(checklinks(graph["nodes"][i]["name"]))){
      toremove.push(i)
    }
  }
  toremove.forEach(index => {
    graph["nodes"].splice(index,1)
  });
  console.log(graph["links"])
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