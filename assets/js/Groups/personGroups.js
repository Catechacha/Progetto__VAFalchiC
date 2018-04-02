function personGroups(){
    var list;

    function me(selection) {
        selection.selectAll("*")
            .remove()
        list = selection.append("div")
            .classed("list-group", true)
            .attr("style", "height:450px; overflow:scroll")
            .selectAll("a")
            .data(function (d) {
                return d
            })
            .enter()
            .append("a")
            .attr("href", "#")
            .classed("list-group-item", true)
            .on("click", function (d) {
                dispatch.selectGroup(d);
            });

        list.append("span")
            .classed("pull-right glyphicon glyphicon-user", true)
        list.append("span")
            .classed("pull-right", true)
            .text(function (d) {
                return d.counter
            });
        list.append("span")
            .text(function (d) {
                return 'Group ' + d.group
            });
    }

    return me;
}