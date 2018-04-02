function PieChart(){
    var svg;
    var nvchart;
    var data;

    function me(selection) {
            if (!svg) {
                svg = selection.append("svg")
                    .attr({width: "100%", height: 300});

                //http://nvd3.org/examples/pie.html
                nvchart = nv.models.pieChart()
                    .x(function (d) {
                        return d.label
                    })
                    .y(function (d) {
                        return d.value
                    })
                    .showLabels(true)
                    .labelThreshold(.0)
                    .labelType('percent')
                    .donut(true)
                    .donutRatio(0.3);


                nvchart.valueFormat(d3.format(''));
            }

            var dataPrepared = prepareData(data)

            svg.datum(dataPrepared)
                .call(nvchart);
    }

    me.setData = function(data1){
        data = data1
        return me
    }

    function prepareData(data){
        var area = ['Entry Corridor', 'Tundra Land', 'Kiddie Land', 'Wet Land', 'Coaster Alley']
        var colormap = {
            'Entry Corridor':'#A797BD', //'#EDEAF1'
            'Tundra Land':'#7DADBD', //'#DBEEF4'
            'Kiddie Land':'#FFEAA0', //'#FFF3CA'
            'Wet Land': '#C7DB9E',//'#C3D59F'
            'Coaster Alley': '#CF8B87'//'#D99591'
        }
        var color =['#EDEAF1', '#DBEEF4', '#FFF3CA', '#C3D59F', '#D99591']
        var result =  []
      //  console.log(data)
        for(var i = 0; i<area.length;i++){
            result[i] = {
                            'label': area[i],
                            'value': +data[i].checkIn,
                            'color': colormap[area[i]]
                        }
        }
     //   console.log(result)
        return result
    }

    return me;
}
