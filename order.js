exports.placeorder = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var email = input.email;
    req.getConnection(function (err, connection) {
        
        var data = {
            storeitemId : input.storeitemId,
            redeemPoints  : input.redeemPoints,
            userName : input.userName,
            email : input.email,  
            phone  : input.phone,
            addL1 : input.addL1,
            addL2 : input.addL2,
            city : input.city,
            state : input.state,
            zipCode : input.zipCode,
            country : input.country
        };
        
        var query = connection.query("INSERT INTO orders set ? ",data, function(err, rows)
        {
  
          if (err){
            console.log(err);
            return res.json({
                "message":"error occured while creating order",
                "status": false
               })
            }else{
                
                connection.query("SELECT * FROM users  WHERE Email = ? ",[email], function(err, rows)
             {
             var id = rows[0].Id;
             var bal = rows[0].Points - input.redeemPoints;

             console.log("id and balance"+id + "  -->"+bal);

             if (err){
                console.log("message : error occured while fetching user");  
            }

             var data1 = {
            Points : bal
        };
        
        connection.query("UPDATE users set ? WHERE Id = ? ",[data1,id], function(err, rows)
        {
  
              if (err){
                console.log("message error occured while updating points");
              }else{
                
                 return res.json({
                "message":"order created successfully",
                "status": true
               })
              }
             
        });

        });

            }

        
          
        });
    
    });
};