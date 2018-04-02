//To register event listeners to handle event
var dispatch = d3.dispatch('changeDay','selectGroup');

dispatch.on('changeDay.buttons', function(newDay){
    console.log("new day is: " + newDay);
    myApp.changeDay(newDay)//update day
    d3.select("#toolbar").select("div.day-group")
        .selectAll("button")
        .classed("btn-primary active",function(d){return d==newDay});
    myApp.createGroupList();
});

dispatch.on('selectGroup.list', function(groupSelected){
    console.log("selected group is: " + groupSelected.group);
    myApp.changeGroup(groupSelected.group)//update day
    d3.select("#persons")
        .selectAll(".list-group-item")
        .classed("active",function(elem){
            return(elem.group==groupSelected.group)
        });
    myApp.updateChart();
});