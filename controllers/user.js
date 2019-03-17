const User = require("../dao/user");
const Notice = require("./notice");

module.exports = {
  // 分页查询
  getByPage: function(req, res, next) {
    const resData = {
      pageNum: req.query.pageNum,
      pageSize: req.query.pageSize
    };
    User.getCount({ ...req.query })
      .then(function(data) {
        if (data && data.length) {
          resData["total"] = data[0]["count(*)"];
          return User.getByPage({ ...req.query });
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
          msg: "获取用户列表失败" + JSON.stringify(e)
        });
      });
  },
  // 登录校验
  loginCheck(req, res, next) {
    User.checkPerson({
      pid: req.body.pid,
      pwd: req.body.pwd
    })
      .then(function(data) {
        if (data && data.length) {
          res.json({
            code: 1,
            data,
            currentAuthority: data[0].identity,
            status: true,
            msg: "登录成功"
          });
        } else {
          res.json({
            code: 0,
            data,
            currentAuthority: "guest",
            status: false,
            msg: "账号或密码错误"
          });
        }
      })
      .catch(function(e) {
        res.json({
          result: -1,
          msg: "登录校验失败" + JSON.stringify(e)
        });
      });
  },

  // 获取用户信息
  getUserInfo: function(req, res, next) {
    User.getUserInfo(req.body.userId)
      .then(function(data) {
        if (data && data.length) {
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
          errmsg: "获取用户信息失败" + JSON.stringify(e)
        });
      });
  },

  // 更新用户信息
  updateUserInfo: function(req, res, next) {
    User.updateUserInfo({ ...req.body })
      .then(function(data) {
        if (data && data.affectedRows > 0) {
          if (req.body.type === "identity") {
            Notice.addNotice({
              acceptId: req.body.id,
              type: 9
            });
          }
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
          msg: "更新信息失败" + JSON.stringify(e)
        });
      });
  },
  deleteById: function(req, res, next) {
    User.deleteById(req.query.id)
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
          msg: "删除用户失败" + JSON.stringify(e)
        });
      });
  },
  getUserSd: function(req, res, next) {
    User.getUserSd(req.query)
      .then(function(data) {
        if (data && data.length) {
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
          errmsg: "获取用户信息失败" + JSON.stringify(e)
        });
      });
  }
};
