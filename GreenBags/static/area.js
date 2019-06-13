var formatTime = d3.timeFormat("%d-%b-%y");
var idnum = document.getElementById("id");
var sacrifices = document.getElementsByTagName("input")
var isChecked = function () {
    var checked = []
    for (let index = 0; index < sacrifices.length; index++) {
        console.log(sacrifices[index])
        
    }
    for (const item of sacrifices) {
        if (item.checked) {
            checked.push(item.id)
        }
    }
    return checked
}
isChecked()
var arrayin = function (arr, el) {
    var result = false
    arr.forEach(elem => {
        if (elem == el) {
            result = true
        }
    })
    return result
}


function parseDate(input) {

    var parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
}
var income;
var balance;
var exp=0;
Promise.all([d3.csv("static/goals.csv"), d3.csv("static/finance.csv")]).then(function (dat) {
    
    d3.selectAll("input").on("change", () => {
        update();
    })
    var update = function () {
        balance=0
        exp=0;
        d3.selectAll("svg").remove()
        dats = []
        for (let i = 0; i < dat[1].length; i++) {
            if (parseInt(dat[1][i]["id"]) == parseInt(idnum.innerHTML)) {
                income = parseFloat(dat[1][i]["income"])
                balance = parseFloat(dat[1][i]["balance"])
                var dailies = dat[1][i]["daily"].substring(1, dat[1][i]["daily"].length - 1).split("'")
                for (let j = 1; j < dailies.length; j += 4) {
                    // I split each of the daily costs for a certain person and that splitting causes space issues so I need to take substrings to parse the data
                    if (!(arrayin(isChecked(), dailies[j]))) {
                        console.log(dailies[j])
                        var val = parseFloat(dailies[j + 2])
                        exp += val * 30.0
                    }
                }
                var monthlies = dat[1][i]["monthly"].substring(1, dat[1][i]["monthly"].length - 1).split("'")
                for (let j = 1; j < monthlies.length; j += 4) {
                    // I split each of the daily costs for a certain person and that splitting causes space issues so I need to take substrings to parse the data
                    if (!(arrayin(isChecked(), monthlies[j]))) {
                        var val = parseFloat(monthlies[j + 2])
                        exp += val
                    }

                }
            }
        }
        var data = []
        for (let i = 0; i < dat[0].length; i++) {
            if (parseInt(dat[0][i]["id"]) == parseInt(idnum.innerHTML)) {
                var start = new Date(parseDate(dat[0][i]["date"]))
                var percent = (dat[0][i]["percentage"]) / 100
                var goal = dat[0][i]["price"]
                var count = 0
                while (goal > 0 && balance > 0) {
                    data.push({
                        "date": formatTime(start),
                        "goal": goal
                    })
                    dats.push({
                        "date": formatTime(start),
                        "balance": parseFloat(balance)
                    })
                    var change = income - exp
                    console.log(income)
                    console.log(exp)
                    balance = balance + change
                    if ((percent * balance) > goal) {
                        goal = 0
                        balance -= percent * balance
                    } else {
                        goal -= percent * balance
                        balance -= percent * balance
                    }
                    start.setMonth(start.getMonth() + 1);
                    count += 1
                }
                if (goal == 0 || balance == 0) {
                    data.push({
                        "date": formatTime(start),
                        "goal": goal
                    })
                    dats.push({
                        "date": formatTime(start),
                        "balance": parseFloat(balance)
                    })
                }
            }
        }
        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 200
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%d-%b-%y");
        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the area
        var area = d3.area()
            .x(function (d) {
                return x(d.date);
            })
            .y0(height)
            .y1(function (d) {
                return y(d.goal);
            });

        // define the line
        var valueline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.goal);
            });

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
            d.date = parseTime(d.date);
            d.close = +d.close;
        });

        // scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.goal;
        })]);
        // add the area

        svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("id", "garea")
        .attr("d", area);

    // add the valueline path.
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("id", "gpath")
            .attr("d", valueline);
            

        // add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 10) + ")")
            .style("text-anchor", "middle")
            .text("Date");

        // add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 100 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Amount Left");

        // define the area
        var area = d3.area()
            .x(function (d) {
                return x(d.date);
            })
            .y0(height)
            .y1(function (d) {
                return y(d.balance);
            });

        // define the line
        var valueline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.balance);
            });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        dats.forEach(function (d) {
            d.date = parseTime(d.date);
            d.close = +d.balance;
        });

        // scale the range of the dats
        x.domain(d3.extent(dats, function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(dats, function (d) {
            return d.balance;
        })]);
        // add the area
        svg.append("path")
            .datum(dats)
            .attr("class", "area")
            .attr("d", area);

        // add the valueline path.
        svg.append("path")
            .datum(dats)
            .attr("class", "line")
            .attr("d", valueline);

        // add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 10) + ")")
            .style("text-anchor", "middle")
            .text("Date");

        // add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 100 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Balance Left");
    }
    update()
});