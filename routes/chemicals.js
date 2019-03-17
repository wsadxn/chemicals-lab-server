const Chemicals = require('../controllers/chemicals');
const express = require('express');
const router = express.Router();

// 获取药品列表
router.get('/query', function(req, res, next){
    Chemicals.getByPage(req, res, next);
});
// 删除所选药品
router.get('/delete', function(req, res, next){
    Chemicals.deleteById(req, res, next);
});
// 验证药品编码是否重复
router.get('/checkCode', function(req, res, next){
    Chemicals.checkCode(req, res, next);
});
// 更新药品信息
router.post('/updateChemicals', function(req, res, next){
    Chemicals.updateChemicals(req, res, next);
});

router.get('/getChemicalSd', function(req, res, next) {   
    Chemicals.getChemicalSd(req,res,next);
});

router.get('/getChemicalsNum', function(req, res, next) {   
    Chemicals.getChemicalsNum(req,res,next);
});

module.exports = router;