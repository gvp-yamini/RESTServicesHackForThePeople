var express = require('express');
var Users = require('./users');
var Store = require('./store');
var Qr = require('./qr');
var Order = require('./order');
var bodyParser = require('body-parser');

var app = express();

var cors = require('cors');

app.use(cors());

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

app.use(bodyParser.json());

app.use(
    connection(mysql,{
        host: '34.68.188.84',
        user: 'root',
        password : 'password',
        port : 3306, //port mysql
        database:'hackforpeople',
        multipleStatements: true

    },'pool') //or single

);

app.get('/',(req,res)=>{
    res.send('hello world');
});

//Getting full list of available users
app.get('/users',Users.getUsers);
app.post('/register',Users.register);
app.post('/authenticate',Users.authenticate);
app.get('/store',Store.getStoreDetails);
app.post('/qrcode',Qr.getNewQR);
app.post('/validateqr',Qr.validateQR);
app.post('/placeorder',Order.placeorder);

//server setting
app.listen(process.env.PORT || 3000,(err)=>{
    if(err){
        console.log(err);
    }
    console.log('Server is running on port 3000');
});