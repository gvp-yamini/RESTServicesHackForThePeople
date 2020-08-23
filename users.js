const CryptoJS = require('crypto-js');

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, 'secret key 123').toString();;
}

function decrypt(data) {
  var bytes = CryptoJS.AES.decrypt(data, 'secret key 123');
  return bytes.toString(CryptoJS.enc.Utf8);
}

exports.getUsers = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM users',function(err,rows)
        {
            
            if (err){
            return res.json({
                "message":"error occured",
                "status":false
               })
            }
    
            if(rows.length > 0){
               return res.json({
                    "status":true,
                    data:{
                        "users":rows
                    }
                 })
            }else{
                return res.json({
                    "message":"no user found",
                    "status":false
                })
            }
                
           
         });
         
         //console.log(query.sql);
    });
  
};
  

exports.register = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var encryptedPassword = encrypt(input.Password);
    req.getConnection(function (err, connection) {
        
        var data = {
            Firstname : input.Firstname,
            Lastname  : input.Lastname,
            Phone : input.Phone,
            Points : input.Points,  
            DOB  : input.DOB,
            Email : input.Email,
            Password : encryptedPassword
        };
        
        var query = connection.query("INSERT INTO users set ? ",data, function(err, rows)
        {
  
          if (err){
            console.log(err);
            return res.json({
                "message":"existing user, register with different emailId",
                "status": false
               })
            }else{

         connection.query("SELECT * FROM users  WHERE Id = ? ",[rows.insertId], function(err, row)
        {

             if (err){
            return res.json({
                "message":"error occured",
                "status":false
               })
            }else{
               return res.json({
                    "message":"user created successfully",
                    "status": true,
                    data: {
                        "user": row
                    }
                })
            }
             
        });
            }
          
        });
    
    });
};

exports.authenticate = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        
       var email = input.Email;
       var password = input.Password;
        
         connection.query("SELECT * FROM users  WHERE Email = ? ",[email], function(err, rows)
        {
             var Dpassword = decrypt(rows[0].Password);

             if (err){
            return res.json({
                "message":"error occured",
                "status":false
               })
            }
              
            if(Dpassword == password){
               return res.json({
                    "status":true,
                    "message" : "authentication successful",
                    data: {
                        "user": rows
                    }
                 })
            }else{
                return res.json({
                    "message":"give valid email or password",
                    "status":false
                })
            }
             
        });
    
    });
};