// example
/* $.post("http://127.0.0.1/3000/api/mc1", function(data, status){
     console.log("ciao");
 });*/

function app(){
    var svg
    var day = 'All'
    var area = 'All'
    var type = 'All'
    var divsId = ['chart1', 'pieChart', 'hourChart','allChart']
    var chart1; // day = All, Area = 1 area
    var pieChart; // day = 1 day, Area = All
    var hourChart; // day = 1 day, Area = 1 area
    var allChart; // day = All , Area = All

    var colormap = {
        'Entry Corridor':'#A797BD', //'#EDEAF1'
        'Tundra Land':'#7DADBD', //'#DBEEF4'
        'Kiddie Land':'#FFEAA0', //'#FFF3CA'
        'Wet Land': '#C7DB9E',//'#C3D59F'
        'Coaster Alley': '#CF8B87'//'#D99591'
    }

    function me (selection){

        //create svg with map
        svg = selection.append("svg")
            .attr('class','park-map')

        //draw toolbar day
        d3.select("#toolbar")
            .call(me.toolbar());

        //draw toolbar area
        d3.select("#area")
            .call(me.toolbarArea());

        d3.select("#type")
            .call(me.toolbarType());

        //initialize graphs
        chart1 = Chart1().setData('',area)
        pieChart = PieChart().setData('')
        hourChart = HourChart().setData('',area)
        allChart = AllChart().setData('')

        me.changeCharts()
    }

    me.toolbar = function(){
        return toolbar(day)
    }

    me.toolbarArea = function(){
        return toolbarArea(area)
    }

    me.toolbarType = function(){
        return toolbarType(type)
    }

    me.changeCharts = function(){
        console.log('Change chart '+day + ' ' +area + ' ' + type)
        if (day == 'All' && area != 'All') {
            $.get('http://localhost:3000/allDay/' + area +'/' + type, function (data, status) {
                chart1.setData(data,colormap[area])
                resetVisibilityCharts('chart1')
                d3.select('#chart1')
                    .call(chart1)
                updateAnnotation()
            })
        }
        if(day!='All' && area =='All'){
            $.get('http://localhost:3000/day/' + day + '/' + type, function (data, status) {
                pieChart.setData(data)
                resetVisibilityCharts('pieChart')
                d3.select('#pieChart')
                    .call(pieChart)
                updateAnnotation()
            })
        }
        if(day!='All' && area !='All'){
            $.get('http://localhost:3000/checkinAreaDay/' + day + '/' + area + '/' + type, function (data, status) {
                hourChart.setData(data,colormap[area])
                resetVisibilityCharts('hourChart')
                d3.select('#hourChart')
                    .call(hourChart)
                updateAnnotation()
            })
        }
        if(day=='All' && area =='All'){
            $.get('http://localhost:3000/checkinAll/'+type, function (data, status) {
                allChart.setData(data)
                resetVisibilityCharts('allChart')
                d3.select('#allChart')
                    .call(allChart)
                updateAnnotation()
            })
        }
    }

    me.changeDay=function(newDay){
        day = newDay
        console.log('day = '+day)
    }

    me.changeArea=function(newArea){
        area= newArea
        console.log('area = '+area)
    }

    me.changeType=function(newType){
        type = newType
        console.log('type = '+type)
    }

    function updateAnnotation(){
        d3.select('#annotationDay')
            .text('Day: '+day)
        d3.select('#annotationArea')
            .text('Area: '+area)
        d3.select('#annotationType')
            .text('Type: '+type)
    }

    function condition(id){
        switch (id) {
            case 'chart1':
                return day == 'All' && area != 'All'
            case 'pieChart':
                return day != 'All' && area == 'All'
            case 'hourChart':
                return day != 'All' && area != 'All'
            case 'allChart':
                return day == 'All' && area == 'All'
        }
        return ''
    }

    function resetVisibilityCharts(id){
        for(var i = 0; i<divsId.length ; i++){
            var chart = d3.select('#' + divsId[i])
            if (condition(divsId[i])){
                if (chart.style('display') != 'block') {
                    chart.style('display', 'block')
                }
            } else {
                chart.style('display', 'none')
            }
        }
    }

    return me;
}

var myApp = app();
d3.select("#parkmap")
    .call(myApp);