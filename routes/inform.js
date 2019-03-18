const Inform = require('../controllers/inform');
const express = require('express');
const router = express.Router();

// 获取公告列表
router.get('/query', function(req, res, next){
    Inform.getByPage(req, res, next);
});
// 删除所选公告
router.get('/delete', function(req, res, next){
    Inform.deleteById(req, res, next);
});
// 更新公告信息
router.post('/update', function(req, res, next){
    Inform.update(req, res, next);
});

module.exports = router;