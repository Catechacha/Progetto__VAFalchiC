function toolbarArea(area){

    function me(selection) {
        selection.append("label")
            .attr("style", "margin-top: 10px; margin-right:5px")
            .text("Area: ");

        selection.append("div")
            .attr({
                id: "mode-group",
                class: "btn-group area-group",
                "data-toggle": "buttons",
                style: "margin-top: 10px; margin-right:20px; margin-bottom: 10px"
            })
            .selectAll("button")
            .data(['All', 'Entry Corridor', 'Tundra Land', 'Kiddie Land','Wet Land', 'Coaster Alley'])
            .enter()
            .append("button")
            .attr({class: "btn btn-group btn-default", role: "group"})
            .classed("btn-primary active",function(d){return d==area})
            .text(function (d) {
                return d
            })
            .on("click", function (d) {
                dispatch.changeArea(d);
            });
    }
    return me
};