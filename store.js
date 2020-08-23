exports.getStoreDetails = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM store',function(err,rows)
        {
            
            if (err){
            return res.json({
                "error":"something error",
                "status":false
               })
            }
    
            if(rows.length > 0){
               return res.json({
                    "status":true,
                    data:{
                        "store":rows
                    }
                 })
            }else{
                return res.json({
                    "error":"no store found",
                    "status":false
                })
            }
         });
    });
};
  