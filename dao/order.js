const _ = require("./query");
const getUuid = require("../libs/utils").getUuid;
const getCurrentTime = require("../libs/utils").getCurrentTime;

module.exports = {
  // 获取分页查询总记录数
  getCount(params) {
    let sqlStr = `select count(*) from orderinfo`;
    delete params["pageNum"];
    delete params["pageSize"];
    if (params["orderDate[0]"]) {
      params.orderDate = [params["orderDate[0]"], params["orderDate[1]"]];
      delete params["orderDate[0]"];
      delete params["orderDate[1]"];
    }
    if (params["submitTime[0]"]) {
      params.submitTime = [params["submitTime[0]"], params["submitTime[1]"]];
      delete params["submitTime[0]"];
      delete params["submitTime[1]"];
    }
    const queryParams = Object.entries(params);

    if (queryParams.length > 2) {
      sqlStr += ` where`;
      queryParams.forEach(function(arr, index) {
        if (arr[0] === "orderDate") {
          sqlStr +=
            ` ${arr[0]} between '${arr[1][0]}' and '${arr[1][1]}'` +
            (index === queryParams.length - 1 ? "" : " and");
        } else if (arr[0] === "submitTime") {
          sqlStr +=
            ` ${arr[0]} between '${arr[1][0]} 00:00:00' and '${
              arr[1][1]
            } 23:59:59'` + (index === queryParams.length - 1 ? "" : " and");
        } else {
          sqlStr +=
            ` ${arr[0]}='${arr[1]}'` +
            (index === queryParams.length - 1 ? "" : " and");
        }
      });
    }
    console.log(sqlStr);
    return _.query(sqlStr);
  },
  // 分页查询
  getByPage(params) {
    let sqlStr = `select * from orderinfo`;
    const pagination = {
      pageNum: params.pageNum,
      pageSize: params.pageSize
    };
    delete params["pageNum"];
    delete params["pageSize"];
    if (params["orderDate[0]"]) {
      params.orderDate = [params["orderDate[0]"], params["orderDate[1]"]];
      delete params["orderDate[0]"];
      delete params["orderDate[1]"];
    }
    if (params["submitTime[0]"]) {
      params.submitTime = [params["submitTime[0]"], params["submitTime[1]"]];
      delete params["submitTime[0]"];
      delete params["submitTime[1]"];
    }
    const queryParams = Object.entries(params);

    if (queryParams.length > 2) {
      sqlStr += ` where`;
      queryParams.forEach(function(arr, index) {
        if (arr[0] === "orderDate") {
          sqlStr +=
            ` ${arr[0]} between '${arr[1][0]}' and '${arr[1][1]}'` +
            (index === queryParams.length - 1 ? "" : " and");
        } else if (arr[0] === "submitTime") {
          sqlStr +=
            ` ${arr[0]} between '${arr[1][0]} 00:00:00' and '${
              arr[1][1]
            } 23:59:59'` + (index === queryParams.length - 1 ? "" : " and");
        } else {
          sqlStr +=
            ` ${arr[0]}='${arr[1]}'` +
            (index === queryParams.length - 1 ? "" : " and");
        }
      });
    }
    sqlStr += ` order by updateTime desc limit ${(pagination.pageNum - 1) *
      pagination.pageSize},${pagination.pageSize}`;
    return _.query(sqlStr);
  },
  addOrder(params) {
    const info = {
      ...params
    };
    info.id = getUuid();
    const time = getCurrentTime();
    info.submitTime = time;
    info.itemsId = JSON.stringify(info.itemsId);
    info.itemsNum = JSON.stringify(info.itemsNum);
    const queryParams = Object.entries(info);
    let sqlStr = `insert into orderinfo set `;
    queryParams.forEach(element => {
      sqlStr += `${element[0]}='${element[1]}',`;
    });
    sqlStr += `updateTime='${time}',state='0'`;
    return _.query(sqlStr).then(data => {
      return {
        data,
        notice: {
          targetId: info.id,
          content: info.applicantId,
          type: 0
        }
      };
    });
  },
  update(params, opt) {
    const info = {
      ...params
    };
    const notice = {};
    if (params.backNum) {
      info.backNum = JSON.stringify(params.backNum);
    }
    const time = getCurrentTime();
    if (opt) {
      switch (opt) {
        case "adopt": {
          info.adoptTime = time;
          notice.acceptId = info.applicantId;
          notice.type = 2;
          notice.targetId = info.id;
          notice.content = info.state;
          break;
        }
        case "receive": {
          info.getTime = time;
          notice.acceptId = info.applicantId;
          notice.type = 3;
          notice.targetId = info.id;
          break;
        }
        case "storage": {
          info.backTime = time;
          notice.acceptId = info.applicantId;
          notice.type = 4;
          notice.targetId = info.id;
          break;
        }
        case "revoke": {
          notice.type = 1;
          notice.content = info.applicantId;
          break;
        }
      }
    }
    const queryParams = Object.entries(info);
    let sqlStr = `update orderinfo set `;
    queryParams.forEach(element => {
      if (element[0] !== "id") {
        sqlStr += `${element[0]}='${element[1]}',`;
      }
    });
    sqlStr += `updateTime='${time}' where id='${info.id}'`;

    return _.query(sqlStr).then(data => {
      return {
        data,
        notice
      };
    });
  },
  getByTime(params) {
    const orderTime =
      "'%" + params.orderTime.split(",").join("%' || '%") + "%'";
    let sqlStr = `select * from orderinfo where orderDate='${
      params.orderDate
    }' and orderTime like ${orderTime} and state!=3 && state!=4 && state!=5`;
    console.log(sqlStr);
    return _.query(sqlStr);
  }
};
