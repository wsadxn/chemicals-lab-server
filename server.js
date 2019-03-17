const express=require('express');
const static=require('express-static');
const bodyParser=require('body-parser');
const multer=require('multer');
const multerObj=multer({dest: './static/upload'});
const mysql=require('mysql');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
// const expressRoute=require('express-route');

var server=express();
 server.listen(3003);

//1.获取请求数据
//get自带
server.use(bodyParser.json());
// server.use(multerObj.any());

//2.cookie、session
server.use(cookieParser());
(function (){
  var keys=[];
  for(var i=0;i<100000;i++){
    keys[i]='a_'+Math.random();
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000  //20min
  }));
})();

//4.route
const userRouter = require('./routes/user');
const chemicals = require('./routes/chemicals');
const instrument = require('./routes/instrument');
const purchase = require('./routes/purchase');
const order = require('./routes/order');
const notice = require('./routes/notice');



server.use('/api/user', userRouter);
server.use('/api/chemicals', chemicals);
server.use('/api/instrument', instrument);
server.use('/api/purchase', purchase);
server.use('/api/order', order);
server.use('/api/notice', notice);