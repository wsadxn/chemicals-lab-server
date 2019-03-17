const Notice = require("../dao/notice");
const User = require("../dao/user");

module.exports = {
  getByPage: function(req, res, next) {
    const resData = {
      pageNum: req.query.pageNum,
      pageSize: req.query.pageSize
    };
    Notice.getCount({ ...req.query })
      .then(function(data) {
        if (data && data.length) {
          resData["total"] = data[0]["count(*)"];
          return Notice.getByPage({ ...req.query });
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
          msg: "获取通知列表失败" + JSON.stringify(e)
        });
      });
  },
  addNotice: function(params) {
    if (
      params.type === 0 ||
      params.type === 1 ||
      params.type === 5 ||
      params.type === 6
    ) {
      let username = "";
      User.getUserInfo(params.content)
        .then(data => {
          if (data && data.length) {
            username = data[0].name;
            switch (params.type) {
              // 物品申请
              case 0: {
                params.sendId = "system";
                params.acceptId = "admin";
                params.content = `${username}提交了新的物品申请，请及时审核`;
                break;
              }
              // 物品申请撤销
              case 1: {
                params.sendId = "system";
                params.acceptId = "admin";
                params.content = `${username}撤销了其物品申请`;
                params.targetId = "";
                break;
              }
              // 采购申请
              case 5: {
                params.sendId = "system";
                params.acceptId = "director";
                params.content = `${username}提交了新的采购申请，请及时审核`;
                break;
              }
              // 物品申请撤销
              case 6: {
                params.sendId = "system";
                params.acceptId = "director";
                params.content = `${username}撤销了其采购申请`;
                params.targetId = "";
                break;
              }
            }
            params.state = 0;
            Notice.addNotice(params)
              .then(data => {
                if (data && data.affectedRows > 0) {
                  console.log("通知新增成功");
                } else {
                  console.log("通知新增失败");
                }
              })
              .catch(function(e) {
                console.log("通知新增失败" + JSON.stringify(e));
              });
          }
        })
        .catch(function(e) {
          console.log("获取用户信息失败" + JSON.stringify(e));
        });
    } else {
      switch (params.type) {
        // 物品申请审核
        case 2: {
          params.sendId = "system";
          params.content =
            params.content == 1
              ? "你的物品申请已通过，请按时前往领取"
              : "抱歉，你的物品申请未通过";
          break;
        }
        // 物品领取
        case 3: {
          params.sendId = "system";
          params.content = "你申请的物品已领取，请按时归还";
          break;
        }
        // 物品归还
        case 4: {
          params.sendId = "system";
          params.content = "你领取的物品已归还成功";
          break;
        }
        // 采购申请审核
        case 7: {
          params.sendId = "system";
          params.content =
            params.content == 1
              ? "你的采购申请已通过"
              : "抱歉，你的采购申请未通过";
          break;
        }
        // 采购完成
        case 8: {
          params.sendId = "system";
          params.content = "你的采购申请已完成";
          break;
        }
        // 权限修改
        case 9: {
          params.sendId = "system";
          params.content = "你的权限已被修改，请及时查看";
          params.targetId = "";
          break;
        }
      }
      params.state = 0;
      Notice.addNotice(params)
        .then(data => {
          if (data && data.affectedRows > 0) {
            console.log("通知新增成功");
          } else {
            console.log("通知新增失败");
          }
        })
        .catch(function(e) {
          console.log("通知新增失败" + JSON.stringify(e));
        });
    }
  },
  // 删除所选通知
  deleteById: function(req, res, next) {
    Notice.deleteById(req.query.id)
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
          msg: "删除通知失败" + JSON.stringify(e)
        });
      });
  },
  update: function(req, res, next) {
    Notice.update(req.body)
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
          msg: "更新通知失败" + JSON.stringify(e)
        });
      });
  }
};
