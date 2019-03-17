const Notice = require('../controllers/notice');
const express = require('express');
const router = express.Router();

// 获取通知列表
router.get('/query', function(req, res, next){
    Notice.getByPage(req, res, next);
});

// 删除所选通知
router.get('/delete', function(req, res, next){
    Notice.deleteById(req, res, next);
});
// 更新通知状态
router.post('/update', function(req, res, next){
    Notice.update(req, res, next);
});

module.exports = router;