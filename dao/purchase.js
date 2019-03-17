const _ = require("./query");
const $sqlQuery = require("./sqlCRUD").purchase;
const getUuid = require("../libs/utils").getUuid;
const getCurrentTime = require("../libs/utils").getCurrentTime;

module.exports = {
  // 获取分页查询总记录数
  getCount(params) {
    let sqlStr = `select count(*) from purchase`;
    delete params["pageNum"];
    delete params["pageSize"];
    const queryParams = Object.entries(params);

    if (queryParams.length > 0) {
      sqlStr += ` where`;
      queryParams.forEach(function(arr, index) {
        if (arr[0] === "state") {
          if (arr[1]) {
            sqlStr +=
              ` ${arr[0]}='${arr[1]}'` +
              (index === queryParams.length - 1 ? "" : " and");
          }
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
    let sqlStr = `select * from purchase`;
    const pagination = {
      pageNum: params.pageNum,
      pageSize: params.pageSize
    };
    delete params["pageNum"];
    delete params["pageSize"];
    const queryParams = Object.entries(params);

    if (queryParams.length > 0) {
      sqlStr += ` where`;
      queryParams.forEach(function(arr, index) {
        if (arr[0] === "state") {
          if (arr[1]) {
            sqlStr +=
              ` ${arr[0]}='${arr[1]}'` +
              (index === queryParams.length - 1 ? "" : " and");
          }
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
  addPurchase(params) {
    const info = {
      ...params
    };
    info.id = getUuid();
    const time = getCurrentTime();
    info.submitTime = time;
    const queryParams = Object.entries(info);
    let sqlStr = `insert into purchase set `;
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
          type: 5
        }
      };
    });
  },
  getExistCount(params) {
    return _.query($sqlQuery.getExistCount, [params.type, params.itemId]);
  },
  update(params) {
    const info = {
      ...params
    };
    const notice = {};
    const time = getCurrentTime();
    if (info.operation) {
      switch (info.operation) {
        case "storage": {
          info.storageTime = time;
          info.state = 2;
          notice.acceptId = info.applicantId;
          notice.type = 8;
          notice.targetId = info.id;
          break;
        }
        case "adopt": {
          info.adoptTime = time;
          notice.acceptId = info.applicantId;
          notice.type = 7;
          notice.targetId = info.id;
          notice.content = info.state;
          break;
        }
        case "modify": {
          info.submitTime = time;
          break;
        }
        case "revoke": {
          info.state = -1;
          notice.type = 6;
          notice.content = info.applicantId;
          break;
        }
      }
    }
    const queryParams = Object.entries(info);
    let sqlStr = `update purchase set `;
    queryParams.forEach(element => {
      if (element[0] !== "id" && element[0] !== "operation") {
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
  }
};
