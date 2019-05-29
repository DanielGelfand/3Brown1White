var selectColor=function(colorNum, colors){
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
}
d3.csv("finance.csv").then(function(dat){
    var data=[]
    var sum=0
    for (const key in dat[0]) {
        if (dat[0].hasOwnProperty(key)) {
            if(key!="id" && key!="income" && key!="balance"){
                sum+=parseInt(dat[0][key])
            }                
        }
    }
    for (const key in dat[0]) {
        if (dat[0].hasOwnProperty(key)) {
            if(key!="id" && key!="income" && key!="balance"){
                var colour = selectColor(Math.floor(Math.random() * 999), 40);
                data.push({"name":key, "count": dat[0][key], "percentage":(dat[0][key]/sum)*100,"color":colour})
            }                
        }
    }
    console.log(data)
    var totalCount = sum;		//calcuting total manually
  
    var width = 540,
    height = 540,
    radius = 200;
  
        var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(100);
  
        var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.count;
        });
  
        var svg = d3.select('body').append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
    var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g");    
  
       g.append("path")
        .attr("d", arc)
      .style("fill", function(d,i) {
          return d.data.color;
      });
  
    g.append("text")
        .attr("transform", function(d) {
        var _d = arc.centroid(d);
        _d[0] *= 1.5;	//multiply by a constant factor
        _d[1] *= 1.5;	//multiply by a constant factor
        return "translate(" + _d + ")";
      })
      .attr("dy", ".50em")
      .style("text-anchor", "middle")
      .text(function(d) {
        if(d.data.percentage < 8) {
          return '';
        }
        return Math.ceil(d.data.percentage) + '%';
      });
        
    g.append("text")
       .attr("text-anchor", "middle")
         .attr('font-size', '4em')
         .attr('y', 20)
       .text(totalCount);
    
})




