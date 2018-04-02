function app(){
    var day =  'Friday'
    var group = ''
    var chartDiv = d3.select('#chart');
    var chartGroup;

    function me (selection){

        //draw toolbar day
        d3.select("#toolbar")
            .call(me.toolbar());


        //initialize graphs
        chartGroup = ChartGroup().setData([])

        me.createGroupList()
    }

    me.toolbar = function(){
        return Toolbar(day)
    }

    me.personGroups = function(){
        return personGroups();
    }

    me.createGroupList = function (){
        $.get("http://localhost:3000/groups/"+day, function(data, status) {
            d3.select("#persons")
                .datum(data)
                .call(me.personGroups())
          //  chartDiv.style('display', 'none')
            chartGroup.setData([])
            chartDiv.call(chartGroup)
            d3.select("#annotationDay")
                .text('Day: ' + day)
        })
    }

    me.changeDay=function(newDay){
        day = newDay
        updateAnnotationGroup('','')
    }

    me.changeGroup = function(selectedGroup){
        group = selectedGroup;
    }

    function updateAnnotationGroup(checkin, movement){
        if(checkin == '' && movement == ''){
            d3.select("#annotationGroup")
                .text('')
        }else
            d3.select("#annotationGroup")
                .text('Group: ' + group + '  ' +'   N. Check-in: ' + checkin + '   N. Movements:' + movement)
    }

    me.updateChart = function(){
        var checkInCount = 0;
        var movCount = 0;
        $.get('http://localhost:3000/groupData/' + group + '/' + day, function (data, status) {
            chartGroup.setData(data)
            chartDiv.call(chartGroup)
            $.get('http://localhost:3000/groupTag/' + group + '/' + day, function (data1, status) {
                for (var i = 0; i < data1.length; i++)
                    if (data1[i].tag == 'check-in')
                        checkInCount++
                    else
                        movCount++
                updateAnnotationGroup(checkInCount, movCount)
            })
        })
    }

    return me;
}

var myApp = app();
d3.select("#chart")
    .call(myApp);