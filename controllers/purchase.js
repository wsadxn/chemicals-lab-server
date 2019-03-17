const Purchase = require("../dao/purchase");
const Chemicals = require("../dao/chemicals");
const Instrument = require("../dao/instrument");
const Notice = require("./notice");

module.exports = {
  addPurchase: function(req, res, next) {
    Purchase.addPurchase(req.body)
      .then(function(resData) {
        if (resData.data && resData.data.affectedRows > 0) {
          Notice.addNotice({ ...resData.notice });
          res.json({
            code: 1,
            data: resData.data
          });
        } else {
          res.json({
            code: 0,
            data: []
          });
        }
      })
      .catch(function(e) {
        res.json({
          result: -1,
          msg: "新增采购信息失败" + JSON.stringify(e)
        });
      });
  },
  getExistCount: function(req, res, next) {
    Purchase.getExistCount(req.query)
      .then(function(data) {
        if (data && data.length) {
          res.json({
            code: 1,
            data: data[0]["count(*)"]
          });
        } else {
          res.json({
            code: 0,
            data: ""
          });
        }
      })
      .catch(function(e) {
        res.json({
          result: -1,
          msg: "获取采购数据失败" + JSON.stringify(e)
        });
      });
  },
  // 分页查询
  getByPage: function(req, res, next) {
    const resData = {
      pageNum: req.query.pageNum,
      pageSize: req.query.pageSize
    };
    Purchase.getCount({ ...req.query })
      .then(function(data) {
        if (data && data.length) {
          resData["total"] = data[0]["count(*)"];
          return Purchase.getByPage({ ...req.query });
        } else {
          res.json({
            code: 0,
            data: {},
            msg: "none"
          });
        }
      })
      .then(function(data) {
        resData["list"] = data;
        res.json({
          code: 1,
          data: resData,
          msg: "success"
        });
      })
      .catch(function(e) {
        res.json({
          result: -1,
          msg: "获取采购列表失败" + JSON.stringify(e)
        });
      });
  },
  update: function(req, res, next) {
    Purchase.update(req.body)
      .then(function(resData) {
        if (resData.data && resData.data.affectedRows > 0) {
          Notice.addNotice({ ...resData.notice });
          if (req.body.operation === "storage") {
            if (req.body.type == "0") {
              Chemicals.updateNumber({
                id: req.body.itemId,
                number: req.body.storageNum
              });
            } else if (req.body.type == "1") {
              Instrument.updateNumber({
                id: req.body.itemId,
                number: req.body.storageNum
              });
            }
          }
          res.json({
            code: 1,
            data: resData.data
          });
        } else {
          res.json({
            code: 0,
            data: []
          });
        }
      })
      .catch(function(e) {
        res.json({
          result: -1,
          msg: "更新采购信息失败" + JSON.stringify(e)
        });
      });
  }
};
