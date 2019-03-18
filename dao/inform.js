const _ = require("./query");
const $sqlQuery = require("./sqlCRUD").inform;
const getUuid = require("../libs/utils").getUuid;
const getCurrentTime = require("../libs/utils").getCurrentTime;

module.exports = {
  // 获取分页查询总记录数
  getCount(params) {
    let sqlStr = `select count(*) from inform`;
    delete params["pageNum"];
    delete params["pageSize"];
    const queryParams = Object.entries(params);

    if (queryParams.length > 0) {
      sqlStr += ` where`;
      queryParams.forEach(function(arr, index) {
        if (arr[0] === "title") {
          sqlStr +=
            ` title like '${"%" + arr[1] + "%"}'` +
            (index === queryParams.length - 1 ? "" : " and");
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
    let sqlStr = `select * from Inform`;
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
        if (arr[0] === "title") {
          sqlStr +=
            ` title like '${"%" + arr[1] + "%"}'` +
            (index === queryParams.length - 1 ? "" : " and");
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
  // 删除所选公告
  deleteById(informId) {
    return _.query($sqlQuery.deleteById, informId);
  },

  // 修改公告信息
  updateInform(params) {
    const id = params.id;
    const queryParams = Object.entries(params);
    let sqlStr = `update inform set `;
    queryParams.forEach(element => {
      if (element[0] !== "updateTime") {
        sqlStr += `${element[0]}='${element[1]}',`;
      }
    });
    const time = getCurrentTime();
    sqlStr += `updateTime='${time}' where id='${id}'`;
    return _.query(sqlStr);
  },
  // 新增公告信息
  addInform(params) {
    const info = {
      ...params
    };
    info.id = getUuid();
    const queryParams = Object.entries(info);
    let sqlStr = `insert into inform set `;
    queryParams.forEach(element => {
      sqlStr += `${element[0]}='${element[1]}',`;
    });
    const time = getCurrentTime();
    sqlStr += `updateTime='${time}'`;
    return _.query(sqlStr);
  },
};
