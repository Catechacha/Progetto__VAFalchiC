function Chart(){
    var svg;
    var nvchart;
    var data;
    var color;

    function me(selection) {
        if (!svg) {
            svg = selection.append("svg")
                .attr({width: "100%", height: 450});

            //http://nvd3.org/examples/multiBar.html
            nvchart = nv.models.multiBarChart()
                .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                .groupSpacing(0.2)    //Distance between each group of bars.

            nvchart.xAxis
                .tickFormat(d3.format(''));
            nvchart.yAxis
                .tickFormat(d3.format(''));

            nv.utils.windowResize(nvchart.update);
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
        var result = []
        var colorMap = ["#c90702","#21148C","#009D0A"]
        var mapDay = ['Friday','Saturday','Sunday']
        for(var i = 0; i < data.length; i++){
            obj = {key: mapDay[i],
                color: colorMap[i]}
            var values = []
            for(var j = 8; j<24; j++){
                count = 0;
                for(var x=0; x < data[i].length;x++){
                    if(data[i][x].hour==j){
                        count = data[i][x].checkIn
                        break
                    }
                }
                if(j<10)
                    hourString = '0'+j
                else
                    hourString = String(j)
                values.push({
                    x: hourString,
                    y: count,
                    series:mapDay[i]
                })
            }
            obj.values = values
            result[i] = obj
        }
        return result
    }

    return me;
}