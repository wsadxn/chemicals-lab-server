const Instrument = require("../dao/instrument");

module.exports = {
  // 分页查询
  getByPage: function(req, res, next) {
    const resData = {
      pageNum: req.query.pageNum,
      pageSize: req.query.pageSize
    };
    Instrument.getCount({ ...req.query })
      .then(function(data) {
        if (data && data.length) {
          resData["total"] = data[0]["count(*)"];
          return Instrument.getByPage({ ...req.query });
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
  // 删除所选仪器
  deleteById: function(req, res, next) {
    Instrument.deleteById(req.query.id)
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
          msg: "删除仪器失败" + JSON.stringify(e)
        });
      });
  },
  // 验证仪器编码是否重复
  checkCode: function(req, res, next) {
    Instrument.checkCode(req.query)
      .then(function(data) {
        if (data && data.length === 0) {
          res.json({
            code: 1,
            msg: "验证通过"
          });
        } else {
          res.json({
            code: 0,
            msg: "验证失败"
          });
        }
      })
      .catch(function(e) {
        res.json({
          result: -1,
          msg: "验验失败" + JSON.stringify(e)
        });
      });
  },
  // 更新仪器信息 -- id === '' ? add : update
  updateInstrument: function(req, res, next) {
    if (req.body.id) {
      Instrument.updateInstrument(req.body)
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
            msg: "更新仪器信息失败" + JSON.stringify(e)
          });
        });
    } else {
      Instrument.addInstrument(req.body)
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
            msg: "新增仪器失败" + JSON.stringify(e)
          });
        });
    }
  },
  getInstrumentSd: function(req, res, next) {
    Instrument.getInstrumentSd()
      .then(function(data) {
        if (data && data.length) {
          res.json({
            code: 1,
            data,
          });
        } else {
          res.json({
            code: 0,
            data: [],
          });
        }
      })
      .catch(function(e) {
        res.json({
          result: -1,
          errmsg: "获取仪器信息失败" + JSON.stringify(e),
        });
      });
  },
};
