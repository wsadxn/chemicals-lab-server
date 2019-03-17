const Chemicals = require("../dao/chemicals");

module.exports = {
  // 分页查询
  getByPage: function(req, res, next) {
    const resData = {
      pageNum: req.query.pageNum,
      pageSize: req.query.pageSize
    };
    Chemicals.getCount({ ...req.query })
      .then(function(data) {
        if (data && data.length) {
          resData["total"] = data[0]["count(*)"];
          return Chemicals.getByPage({ ...req.query });
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
  // 删除所选药品
  deleteById: function(req, res, next) {
    Chemicals.deleteById(req.query.id)
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
          msg: "删除药品失败" + JSON.stringify(e)
        });
      });
  },
  // 验证药品编码是否重复
  checkCode: function(req, res, next) {
    Chemicals.checkCode(req.query)
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
  // 更新药品信息 -- id === '' ? add : update
  updateChemicals: function(req, res, next) {
    if (req.body.id) {
      Chemicals.updateChemicals(req.body)
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
            msg: "更新药品信息失败" + JSON.stringify(e)
          });
        });
    } else {
      Chemicals.addChemicals(req.body)
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
            msg: "新增药品失败" + JSON.stringify(e)
          });
        });
    }
  },
  getChemicalSd: function(req, res, next) {
    Chemicals.getChemicalSd()
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
          errmsg: "获取药品信息失败" + JSON.stringify(e),
        });
      });
  },
  getChemicalsNum: function(req, res, next) {
    Chemicals.getChemicalsNum()
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
          errmsg: "获取药品信息失败" + JSON.stringify(e),
        });
      });
  },
};
