const Inform = require("../dao/inform");
const Purchase = require("../dao/purchase");
const Order = require("../dao/order");

module.exports = {
  // 分页查询
  getByPage: function(req, res, next) {
    const resData = {
      pageNum: req.query.pageNum,
      pageSize: req.query.pageSize
    };
    Inform.getCount({ ...req.query })
      .then(function(data) {
        if (data && data.length) {
          resData["total"] = data[0]["count(*)"];
          return Inform.getByPage({ ...req.query });
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
          msg: "获取列表失败" + JSON.stringify(e)
        });
      });
  },
  // 删除所选公告
  deleteById: function(req, res, next) {
    Inform.deleteById(req.query.id)
      .then(function(data) {
        if (data && data.affectedRows > 0) {
          res.json({
            code: 1,
            data
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
          msg: "删除公告失败" + JSON.stringify(e)
        });
      });
  },

  // 更新公告信息 -- id === '' ? add : update
  update: function(req, res, next) {
    if (req.body.id) {
      Inform.updateInform(req.body)
        .then(function(data) {
          if (data && data.affectedRows > 0) {
            res.json({
              code: 1,
              data
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
            msg: "更新公告信息失败" + JSON.stringify(e)
          });
        });
    } else {
      Inform.addInform(req.body)
        .then(function(data) {
          if (data && data.affectedRows > 0) {
            res.json({
              code: 1,
              data
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
            msg: "新增公告失败" + JSON.stringify(e)
          });
        });
    }
  },
  getMonthNum: function(req, res, next) {
    const arr = [];
    const time = new Date();
    const currentMonth = time.getMonth() + 1;
    const year = time.getFullYear();
    for (let i = 0; i < 6; i++) {
      const month =
        currentMonth - i > 0
          ? year +
            "-" +
            (currentMonth - i > 9 ? currentMonth - i : "0" + (currentMonth - i))
          : year -
            1 +
            "-" +
            (currentMonth - i + 12 > 9
              ? currentMonth - i + 12
              : "0" + (currentMonth - i + 12));
      arr.unshift(month);
    }
    Promise.all([
      ...arr.map(value => {
        return Purchase.getMonthNum(0, value + "%").then(
          data => data[0]["num"] || 0
        );
      }),
      ...arr.map(value => {
        return Purchase.getMonthNum(1, value + "%").then(
          data => data[0]["num"] || 0
        );
      }),
      ...arr.map(value => {
        return Order.getMonthNum(value + "%").then(data => data[0]["num"] || 0);
      })
    ]).then(data => {
      res.json({
        code: 1,
        data: {
          month: arr,
          chemicals: data.slice(0, 6),
          instrument: data.slice(6, 12),
          order: data.slice(12)
        },
        msg: "success"
      });
    });
  }
};
