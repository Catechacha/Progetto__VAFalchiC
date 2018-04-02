function toolbarType(type){

    function me(selection) {
        selection.append("label")
            .attr("style", "margin-top: 10px; margin-right:5px")
            .text("Type: ");

        selection.append("div")
            .attr({
                id: "mode-group",
                class: "btn-group type-group",
                "data-toggle": "buttons",
                style: "margin-top: 10px; margin-right:20px; margin-bottom: 10px"
            })
            .selectAll("button")
            .data(['All','Check-in', 'Movement'])
            .enter()
            .append("button")
            .attr({class: "btn btn-type btn-default", role: "type"})
            .classed("btn-primary active",function(d){return d==type})
            .text(function (d) {
                return d
            })
            .on("click", function (d) {
                dispatch.changeType(d);
            });
    }
    return me
};