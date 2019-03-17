const Purchase = require('../controllers/purchase');
const express = require('express');
const router = express.Router();

router.post('/addPurchase', function(req, res, next){
    Purchase.addPurchase(req, res, next);
});

router.get('/getExistCount', function(req, res, next){
    Purchase.getExistCount(req, res, next);
});

// 获取采购列表
router.get('/query', function(req, res, next){
    Purchase.getByPage(req, res, next);
});

router.post('/update', function(req, res, next){
    Purchase.update(req, res, next);
});

module.exports = router;