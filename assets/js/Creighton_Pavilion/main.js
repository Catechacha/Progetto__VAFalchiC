function app(){
    var chartDiv = d3.select('#chart');
    var chart;

    function me (selection){
        chart = Chart().setData([])
        me.updateChart()
    }

     me.updateChart = function(){
        $.get('http://localhost:3000/checkInCreightonPavilion', function (data, status) {
            chart.setData(data)
            chartDiv.call(chart)
        })
     }

    return me;
}

var myApp = app();
d3.select('#chart')
    .call(myApp);