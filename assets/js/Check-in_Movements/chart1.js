function Chart1(){
    var svg;
    var nvchart;
    var data;
    var color;

    function me(selection) {
            if (!svg) {
                svg = selection.append("svg")
                    .attr({width: "100%", height: 300});

                //http://nvd3.org/examples/multiBarHorizontal.html
                nvchart = nv.models.multiBarHorizontalChart()
                    .x(function (d) {
                        return d.label
                    })
                    .y(function (d) {
                        return d.value
                    })
                    .showLegend(false)
                    .showControls(false);

                nvchart.yAxis
                    .tickFormat(d3.format(''));

                nvchart.valueFormat(d3.format(''));

                nv.utils.windowResize(nvchart.update);

            }

            var dataPrepared = prepareData(data)

            svg.datum(dataPrepared)
                .call(nvchart);

    }


    function prepareData(data){
        return [
            {
                key:"Check-in count",
                color: color,
                values:
                    [
                        {
                            "label" : "Friday" ,
                            "value" : +data[0].checkInFri
                        } ,
                        {
                            "label" : "Saturday" ,
                            "value" : +data[1].checkInSat
                        } ,
                        {
                            "label" : "Sunday" ,
                            "value" : +data[2].checkInSun
                        }
                    ]
            }
        ]
    }

    me.setData = function(data1,color1){
        color = color1
        data = data1
        return me
    }

    return me;
}
