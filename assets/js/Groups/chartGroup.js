function ChartGroup(){
    var svg;
    var nvchart;
    var data;
    var color;

    function me(selection) {
            if (!svg) {
                svg = selection.append("svg")
                    .attr({width: "100%"/*, height: 300*/});

                //http://nvd3.org/examples/scatter.html
                nvchart = nv.models.scatterChart()
                    .showYAxis(true)
                    .showXAxis(true)
                    .duration(350)
                    .showLegend(false)
                    .color(d3.scale.category10().range());

                nvchart.forceX([0,99])
                nvchart.forceY([0,99])
                nvchart.yAxis
                    .tickFormat(d3.format(''))

                nvchart.xAxis
                    .tickFormat(d3.format(''))
                nv.utils.windowResize(nvchart.update);

                nvchart.tooltip.contentGenerator(function(d) {
                    return('X: ' + d.point.x + '<br> Y: </h5>' + d.point.y + '<br> N°: ' +d.point.size)
                });
            }

            if(data.length!=0)
                var dataPrepared = prepareData(data)
            else
                dataPrepared = data
            svg.datum(dataPrepared)
                .call(nvchart);
    }

    me.setData = function(data1){
        data = data1
        return me
    }

    function prepareData(data){
        for(var i = 0;i<data.length;i++){
            data[i]= {
                    x: +data[i].x,
                    y: +data[i].y,
                    size: +data[i].size, //how many times that point has been visited
                    shape:'circle'
                }
        }
        return [{
            key: data[0].group,
            values: data
        }]
    }

    return me;
}
