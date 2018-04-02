//npm clean
//delete folder node_modules
//npm install

//create a connector to access the database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mc1.db');
console.log(db);

var dayMap = {
    'Friday':'Fri',
    'Saturday':'Sat',
    'Sunday':'Sun'
}

function conditionArea(area){
 //possible area: 'Entry Corridor', 'Tundra Land', 'Kiddie Land','Wet Land', 'Coaster Alley'
    switch (area) {
        case 'Entry Corridor':
            return ' x>50 and x<73 and y<=100 and y>55'
        case 'Tundra Land':
            return ' ((y<=100 and y>55 and x>=0 and x<=27) or(y<=100 and y>57 and x>27 and x<=42) or (y<=100 and y>55 and x>42 and x<=50))'
        case 'Kiddie Land':
            return ' ((y<=100 and y>55 and x>=73 and x<88) or(y<=100 and y>63 and x>=88)) '
        case 'Wet Land':
            return ' ((y<55 and y>32 and x>=0 and x<82) or(y<=59 and y>=55 and x>27 and x <=42)) '
        case 'Coaster Alley':
            return ' ((y<=31 and y>=0 and x>=0) or (y<=55 and y>32 and x>82 and x <88) or (y<=63 and y>55 and x>=88)) '
    }
    return ''
}

//initialize express
var express = require('express');
var restapi = express();

//retrieve all groups of a day
restapi.get('/groups/:day',function(req,res){
    db.all('SELECT group' + dayMap[req.params.day] + '."group", count(group' + dayMap[req.params.day] + '.id) AS counter ' +
        ' FROM group' + dayMap[req.params.day]
        + ' GROUP BY group' + dayMap[req.params.day] + '."group"',
        function(err, rows){
            res.json(rows);
        })
})

//retrieve all point that a group has visited (movement or check-in) in a day
restapi.get('/groupData/:group/:day',function(req,res){
    db.all('select x, y, count(id) as size '
        + 'from mov'+dayMap[req.params.day]
        +' where mov' + dayMap[req.params.day] + '.id in '
        +' (select group'+dayMap[req.params.day]+'.id from group'+dayMap[req.params.day]
        +' where group' + dayMap[req.params.day] + '."group" = '+ req.params.group+ ') ' +
        ' group by x, y ',
        function(err, rows){
            res.json(rows);
        })
})

//retrieve all movement or check-in of a group in a day
restapi.get('/groupTag/:group/:day',function(req,res){
    db.all('select tag '
        + 'from mov'+dayMap[req.params.day]
        +' where mov' + dayMap[req.params.day] + '.id in '
        +' (select group'+dayMap[req.params.day]+'.id from group'+dayMap[req.params.day]
        +' where group' + dayMap[req.params.day] + '."group" = '+ req.params.group+ ') ',
        function(err, rows){
            res.json(rows);
        })
})



//retrieve check-in/movement for an area for all days
restapi.get('/allDay/:area/:type',function(req,res){
    var area = req.params.area
    var type = req.params.type.toLowerCase()
    var conditionType
    if(type != 'all')
        conditionType = ' and tag = "' + type + '" '
    else
        conditionType = ' and 1=1 '
    db.all('select count(*) as checkInFri from movFri where '+conditionArea(area) + ' ' + conditionType,
        function(err, rowFri) {
            db.all('select count(*) as checkInSat from movSat where ' + conditionArea(area) + ' ' + conditionType,
                function (err, rowSat) {
                    db.all('select count(*) as checkInSun from movSun where ' + conditionArea(area) + ' ' + conditionType,
                        function (err, rowSun) {
                            var array = []
                            array[0] = (rowFri[0])
                            array[1]=(rowSat[0])
                            array[2]=(rowSun[0])
                            res.json(array)
                        })
                })
        })
})

//retrieve all checkin/movement for a day divided for area
restapi.get('/day/:day/:type',function(req,res){
    var type = req.params.type.toLowerCase()
    var conditionType
    if(type != 'all')
        conditionType = ' and tag = "' + type + '" '
    else
        conditionType = ' and 1=1 '
    db.all('select count(*) as checkIn from mov' +  dayMap[req.params.day]
        + ' where '+conditionArea('Entry Corridor') + conditionType, function(err, rows1){
        db.all('select count(*) as checkIn from mov' +  dayMap[req.params.day]
            + '  where ' +conditionArea('Tundra Land') + conditionType, function(err, rows2){
            db.all('select count(*) as checkIn from mov' +  dayMap[req.params.day]
                + '  where '+conditionArea('Kiddie Land')+ conditionType, function(err, rows3){
                db.all('select count(*) as checkIn from mov' +  dayMap[req.params.day]
                    + '  where '+conditionArea('Wet Land') + conditionType, function(err, rows4){
                    db.all('select count(*) as checkIn from mov' +  dayMap[req.params.day]
                        + '  where '+ conditionArea('Coaster Alley')+ conditionType,
                        function(err, rows5){
                            var array = []
                            array[0] = (rows1[0])
                            array[1] = (rows2[0])
                            array[2] = (rows3[0])
                            array[3] = (rows4[0])
                            array[4] = (rows5[0])
                            res.json(array)
                        })
                })
            })
        })
    })
})

/*retrieve all checkin/movement by hour for an area and a day*/
restapi.get('/checkinAreaDay/:day/:area/:type',function(req,res) {
    var type = req.params.type.toLowerCase()
    var conditionType
    if(type != 'all')
        conditionType = ' and tag = "' + type + '" '
    else
        conditionType = ' and 1=1 '
    db.all('select distinct substr(cast(ts as text),11,2) as hour, count(*) as checkIn ' +
        ' from mov' + dayMap[req.params.day] + ' where ' + conditionArea(req.params.area) + conditionType
        + ' GROUP BY substr(cast(ts as text),11,2)',
        function (err, row) {
            res.json(row)
        })
})

/*retrieve all checkin/movement by hour for all day*/
restapi.get('/checkinAll/:type',function(req,res) {
    var type = req.params.type.toLowerCase()
    var conditionType
    if(type != 'all')
        conditionType = ' tag = "' + type + '" '
    else
        conditionType = ' 1=1 '
    db.all('select substr(cast(ts as text),11,2) as hour, count(*) as checkIn ' +
        ' from movFri where '+conditionType + ' '
        + ' GROUP BY substr(cast(ts as text),11,2)',
        function (err, rows1){
            db.all('select substr(cast(ts as text),11,2) as hour, count(*) as checkIn ' +
                ' from movSat where '+conditionType + ' '
                + ' GROUP BY substr(cast(ts as text),11,2)',
                function (err, rows2){
                    db.all('select substr(cast(ts as text),11,2) as hour, count(*) as checkIn ' +
                        ' from movSun where '+conditionType + ' '
                        + ' GROUP BY substr(cast(ts as text),11,2)',
                        function (err, rows3){
                            var array = []
                            array[0] = rows1
                            array[1] = rows2
                            array[2] = rows3
                            res.json(array)
                        })
                })
        })
})

/*retrieve all checkin/movement by hour for all day in attraction 32 (Creighton Pavilion)*/
restapi.get('/checkInCreightonPavilion',function(req,res) {
    db.all('select substr(cast(ts as text),11,2) as hour, count(*) as checkIn '
        + ' from movFri where tag = "check-in" and x=32 and y = 33 '
        + ' GROUP BY substr(cast(ts as text),11,2) order by substr(cast(ts as text),11,2)',
        function (err, rows1){
            db.all('select distinct substr(cast(ts as text),11,2) as hour, count(*) as checkIn ' +
                ' from movSat where tag = "check-in" and x=32 and y = 33 '
                + ' GROUP BY substr(cast(ts as text),11,2) order by substr(cast(ts as text),11,2)',
                function (err, rows2){
                    db.all('select distinct substr(cast(ts as text),11,2) as hour, count(*) as checkIn ' +
                        ' from movSun where tag = "check-in" and x=32 and y = 33 '
                        + ' GROUP BY substr(cast(ts as text),11,2) order by substr(cast(ts as text),11,2)',
                        function (err, rows3){
                            var array = []
                            array[0] = rows1
                            array[1] = rows2
                            array[2] = rows3
                            res.json(array)
                        })
                })
        })
})

restapi.listen(3000);
console.log('Listening on port 3000...');

