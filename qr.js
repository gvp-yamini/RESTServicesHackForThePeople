exports.getNewQR = function (req, res) {

    var input = JSON.parse(JSON.stringify(req.body));

    req.getConnection(function (err, connection) {

        
    var vehicleId = input.vehicleId;
    
  
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 32;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
        var myDate = new Date();
        var sql = 'INSERT INTO `hackforpeople`.`vehicleTrip` (`QRcode`, `status`,`dateCreated`,`vehicleId`) VALUES (?)';
        var values= [];
        values.push(randomstring);
        values.push('new');
        values.push(myDate);
       
       values.push(vehicleId);
        var query = connection.query(sql,[values], function (err, rows) {
            if (err) {
                return res.json({
                    "error": err,
                    "status": false
                })
            }
            console.log("rows : ",rows);
            if (rows.affectedRows == 1 && (rows.insertId != null ||rows.insertId != undefined)) {



         connection.query("SELECT * FROM vehicleTrip  WHERE tripId = ? ",[rows.insertId], function(err, rows)
        {

             if (err){
            return res.json({
                "message":"error occured",
                "status":false
               })
            }else{
               return res.json({
                    "status": true,
                    data: {
                        "qr": rows
                    }
                })
            }
             
        });

            } else {
                return res.json({
                    "error": "QR code not generated",
                    "status": false
                })
            }


        });

        
    });

};


exports.validateQR = function (req, res) {

    var input = JSON.parse(JSON.stringify(req.body));

    req.getConnection(function (err, connection) {

        
    var qr = input.QRcode;
    var email = input.Email;

     connection.query("SELECT * FROM vehicleTrip  WHERE QRcode = ? ",[qr], function(err, row)
        {

             if (err){
            return res.json({
                "message":"error occured",
                "status":false
               })
            }else{

                if(row.length != 1){
                    return res.json({
                    "message":"Not a valid qr code",
                    "status": false
                  })

                }else{
                    if("new" != row[0].status){
                          return res.json({
                    "message":"qr code already used",
                    "status": false
                      })
                    }else{

                       var data = {
                              status : "used"
                           };
        
                        connection.query("UPDATE vehicleTrip set ? WHERE vehicleId = ? ",[data,row[0].vehicleId], function(err, rows)
                        {
                  
                          if (err)
                              console.log("Error Updating : %s ",err );
                              });

                        connection.query("SELECT * FROM users  WHERE Email = ? ",[email], function(err, rows1){
                             //console.log(rows1);
                             var diff = rows1[0].Points + 50;
                                 
                              var data1 = {
                               Points : diff 
                           };

                         connection.query("UPDATE users set ? WHERE Email = ? ",[data1,email], function(err, rows)
                        {

                  
                          if (err)
                              console.log("Error Updating : %s ",err );

                              return res.json({
                    "message":"updated successfully",
                    "status": true,
                })


                              });


                          });

                        
                          

                    }
                }
              
               
            }
             
        });

        
    });

};