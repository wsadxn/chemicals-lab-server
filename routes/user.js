const User=require('../controllers/user');
const express = require('express');
const router  = express.Router();

// 获取药品列表
router.get('/query', function(req, res, next){
  User.getByPage(req, res, next);
});
// 登录
router.post('/login',function(req, res, next) {
  User.loginCheck(req,res,next);
});

// 获取当前用户个人信息
router.post('/currentUser',function(req, res, next) {
  User.getUserInfo(req,res,next);
});

// 更新用户信息
router.post('/updateUserInfo',function(req, res, next) {
  User.updateUserInfo(req,res,next);
});

// 用户id-name
router.get('/getUserSd', function(req, res, next) {   
    User.getUserSd(req,res,next);
});

router.get('/delete', function(req, res, next){
  User.deleteById(req, res, next);
});

module.exports = router;
