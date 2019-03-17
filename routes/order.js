const Order = require("../controllers/order");
const express = require("express");
const router = express.Router();

router.post("/addOrder", function(req, res, next) {
  Order.addOrder(req, res, next);
});

router.get("/query", function(req, res, next) {
  Order.getByPage(req, res, next);
});

router.post("/update", function(req, res, next) {
  Order.update(req, res, next);
});

router.get("/getUnusedIns", function(req, res, next) {
  Order.getUnusedIns(req, res, next);
});

module.exports = router;
