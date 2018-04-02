function AllChart(){
    var svg;
    var nvchart;
    var data;

    var dimensionDataArray = []

    function me(selection) {
        if (!svg) {
            svg = selection.append("svg")
                .attr({width: "100%", height: 300});

            //https://github.com/nvd3-community/nvd3/blob/gh-pages/examples/lineChart.html
            nvchart = nv.models.lineChart()
                .options({
                    duration: 300,
                    useInteractiveGuideline: true
                })
            ;

            nvchart.xAxis
                .axisLabel('Hour')
                .tickValues(function(d) {
                    var valuesAxis = []
                    for(var c = 0; c<d[0].values.length;c++){
                        valuesAxis.push(d[0].values[c].x)
                    }
                    return valuesAxis })
                .tickFormat(function(d) {
                    if (d == null) {
                        return 'N/A';
                    }
                    return d3.format('')(d);
                })
            ;
            nvchart.yAxis
                .axisLabel('Count')
                .tickFormat(function(d) {
                    if (d == null) {
                        return 'N/A';
                    }
                    return d3.format('')(d);
                })
        }

        var dataPrepared = prepareData(data)

        svg.datum(dataPrepared)
            .call(nvchart);

    }

    function prepareData(data){
        var index
        var days = ['Friday', 'Saturday', 'Sunday']
        var result = []
        for(var i = 0; i < 3; i++){
            result[i] = []
            for(var j = 8;j<24;j++){
                if(j<10)
                    index = '0'+j
                else
                    index = j
                result[i].push({'x': index, 'y': data[i][j-8].checkIn})
            }
        }
        //console.log(result)
        return [
            {
                values: result[0],
                key: 'Friday',
                color: "#c90702",
                strokeWidth: 2.5
            },
            {
                values: result[1],
                key: 'Saturday',
                color: "#21148C",
                strokeWidth: 2.5
            },
            {
                values: result[2],
                key: 'Sunday',
                color: "#009D0A",
                strokeWidth: 2.5
            },

        ]
    }

    me.setData = function(data1){
        data = data1
        return me
    }

    return me;
}