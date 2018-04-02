function HourChart(){
    var svg;
    var nvchart;
    var data;
    var color;

    function me(selection) {
            if (!svg) {
                svg = selection.append("svg")
                .attr({width: "100%", height: 300});

                //http://nvd3.org/examples/discreteBar.html
                nvchart = nv.models.discreteBarChart()
                    .x(function(d){
                        return d.label
                    })
                    .y(function(d){
                        return d.value
                    })
                    .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
                    .showValues(false);      //...instead, show the bar value right on top of each bar.

                nvchart.yAxis
                    .tickFormat(d3.format(''));
                nvchart.valueFormat(d3.format(''));

                nv.utils.windowResize(nvchart.update);
            }
            var dataPrepared = prepareData(data)

            svg.datum(dataPrepared)
                .call(nvchart);

    }

    me.setData = function(data1,color1){
        color  = color1
        data = data1
        return me
    }

    function writeHour(hour){
        if(hour<10)
            return '0'+hour
        return hour
    }

    function getValue(hour, data){
        if(hour<10)
            hour = '0'+hour
        for(var j = 0; j<data.length;j++){
            if(data[j].hour == hour)
                return data[j].checkIn
        }
        return 0;
    }

    function prepareData(data){
        var result =  []
        for(var i = 8; i<24;i++){
            result[i-8] = {
                'label': writeHour(i),
                'value': getValue(i,data),
                'color': color
            }
        }
        return  [
                    {
                        key: "Check in for hour",
                        values: result
                    }
                ]
    }

    return me;
}
