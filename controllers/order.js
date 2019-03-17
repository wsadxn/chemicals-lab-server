const Order = require("../dao/order");
const User = require("../dao/user");
const Chemicals = require("../dao/chemicals");
const Instrument = require("../dao/instrument");
const Notice = require("./notice");

module.exports = {
  addOrder: function(req, res, next) {
    Order.addOrder(req.body)
      .then(function(resData) {
        if (resData.data && resData.data.affectedRows > 0) {
          Notice.addNotice({ ...resData.notice });
          if (req.body.itemsId.chemicals) {
            req.body.itemsId.chemicals.map((value, index) => {
              number = req.body.itemsNum.chemicals[index];
              Chemicals.updateNumber({
                id: value,
                number: -number
              });
            });
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
          msg: "新增预约信息失败" + JSON.stringify(e)
        });
      });
  },
  getByPage: function(req, res, next) {
    const resData = {
      pageNum: req.query.pageNum,
      pageSize: req.query.pageSize
    };
    Order.getCount({ ...req.query })
      .then(function(data) {
        if (data && data.length) {
          resData["total"] = data[0]["count(*)"];
          return Order.getByPage({ ...req.query });
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
          msg: "获取预约列表失败" + JSON.stringify(e)
        });
      });
  },
  update: function(req, res, next) {
    const opt = req.body.operation;
    const record = req.body.record;
    if (opt === "storage" || opt === "receive") {
      User.checkPerson({
        pid: record.applicantId,
        pwd: req.body.password
      })
        .then(function(data) {
          if (data && data.length) {
            Order.update(record, opt)
              .then(function(resData) {
                if (resData.data && resData.data.affectedRows > 0) {
                  Notice.addNotice({ ...resData.notice });
                  if (opt === "storage") {
                    if (record.itemsId.chemicals) {
                      record.itemsId.chemicals.map((value, index) => {
                        number = record.backNum.chemicals[index];
                        Chemicals.updateNumber({
                          id: value,
                          number: number
                        });
                      });
                    }
                    if (record.itemsId.instrument) {
                      record.itemsId.instrument.map((value, index) => {
                        number =
                          record.itemsNum.instrument[index] -
                          record.backNum.instrument[index];
                        Instrument.updateNumber({
                          id: value,
                          number: -number
                        });
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
                  msg: "更新预约信息失败" + JSON.stringify(e)
                });
              });
          } else {
            res.json({
              code: 0,
              status: false,
              msg: "密码错误"
            });
          }
        })
        .catch(function(e) {
          res.json({
            result: -1,
            msg: "密码校验失败" + JSON.stringify(e)
          });
        });
    } else {
      Order.update(record, opt)
        .then(function(resData) {
          if (resData.data && resData.data.affectedRows > 0) {
            Notice.addNotice({ ...resData.notice });
            if ((opt === "adopt" && record.state == "4") || opt === "revoke") {
              if (record.itemsId.chemicals) {
                record.itemsId.chemicals.map((value, index) => {
                  number = record.itemsNum.chemicals[index];
                  Chemicals.updateNumber({
                    id: value,
                    number: number
                  });
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
            msg: "更新预约信息失败" + JSON.stringify(e)
          });
        });
    }
  },
  getUnusedIns: function(req, res, next) {
    const obj = {};
    Instrument.getInstrumentNum()
      .then(function(data) {
        if (data && data.length) {
          data.map(value => {
            obj[value.id] = value.number;
          });
          return Order.getByTime(req.query);
        } else {
          res.json({
            code: 0,
            data: {},
            msg: "error"
          });
        }
      })
      .then(function(data) {
        if (data && data.length) {
          data.map(value => {
            const itemsId = JSON.parse(value.itemsId).instrument;
            const itemsNum = JSON.parse(value.itemsNum).instrument;
            itemsId.map((value, index) => {
              obj[value] = obj[value] - itemsNum[index];
            });
          });
        }
        res.json({
          code: 1,
          data: obj,
          msg: "success"
        });
      })
      .catch(function(e) {
        res.json({
          result: -1,
          msg: "获取仪器数量失败" + JSON.stringify(e)
        });
      });
  }
};
