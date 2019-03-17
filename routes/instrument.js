const Instrument = require('../controllers/instrument');
const express = require('express');
const router = express.Router();

// 获取仪器列表
router.get('/query', function(req, res, next){
    Instrument.getByPage(req, res, next);
});
// 删除所选仪器
router.get('/delete', function(req, res, next){
    Instrument.deleteById(req, res, next);
});
// 验证仪器编码是否重复
router.get('/checkCode', function(req, res, next){
    Instrument.checkCode(req, res, next);
});
// 更新仪器信息
router.post('/updateInstrument', function(req, res, next){
    Instrument.updateInstrument(req, res, next);
});

router.get('/getInstrumentSd', function(req, res, next) {   
    Instrument.getInstrumentSd(req,res,next);
});

module.exports = router;