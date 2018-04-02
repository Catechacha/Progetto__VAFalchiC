//To register event listeners to handle event
var dispatch = d3.dispatch('changeDay', 'changeArea', 'changeType');

dispatch.on("changeDay.buttons", function(newDay){
    console.log("new day is: " + newDay);
    myApp.changeDay(newDay)//update day
    d3.select("#toolbar").select("div.day-group")
        .selectAll("button")
        .classed("btn-primary active",function(d){return d==newDay});
    myApp.changeCharts();
});

dispatch.on("changeArea.buttons", function(newArea){
    console.log("new area is: " + newArea);
    myApp.changeArea(newArea)//update area
    d3.select("#area").select("div.area-group")
        .selectAll("button")
        .classed("btn-primary active",function(d){return d==newArea});
    myApp.changeCharts();

});

dispatch.on("changeType.buttons", function(newType){
    console.log("new type is: " + newType);
    myApp.changeType(newType)//update type
    d3.select("#type").select("div.type-group")
        .selectAll("button")
        .classed("btn-primary active",function(d){return d==newType});
    myApp.changeCharts();
});
