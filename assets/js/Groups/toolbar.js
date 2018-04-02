function Toolbar(day){

    function me(selection) {
        selection.append("label")
            .attr("style", "margin-top: 10px; margin-right:5px")
            .text("Day: ");

        selection.append("div")
            .attr({
                id: "mode-group",
                class: "btn-group day-group",
                "data-toggle": "buttons",
                style: "margin-top: 10px; margin-right:20px; margin-bottom: 10px"
            })
            .selectAll("button")
            .data(['Friday', 'Saturday', 'Sunday'])
            .enter()
            .append("button")
            .attr({class: "btn btn-group btn-default", role: "group"})
            .classed("btn-primary active",function(d){return d==day})
            .text(function (d) {
                return d
            })
            .on("click", function (d) {
                dispatch.changeDay(d);
            });
    }
    return me
};