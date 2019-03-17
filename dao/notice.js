const _ = require("./query");
const $sqlQuery = require("./sqlCRUD").notice;
const getUuid = require("../libs/utils").getUuid;
const getCurrentTime = require("../libs/utils").getCurrentTime;

module.exports = {
  // 获取分页查询总记录数
  getCount(params) {
    let sqlStr = `select count(*) from notice`;
    delete params["pageNum"];
    delete params["pageSize"];
    const queryParams = Object.entries(params);
    if (queryParams.length > 0) {
      sqlStr += ` where`;
      queryParams.forEach(function(arr) {
        if (arr[0] !== "identity" && arr[0] !== "acceptId") {
          sqlStr += ` ${arr[0]}='${arr[1]}' and`;
        }
      });
      switch (params.identity) {
        case "0": {
          sqlStr += ` (acceptId='${params.acceptId}'||acceptId='student')`;
          break;
        }
        case "1": {
          sqlStr += ` (acceptId='${params.acceptId}'||acceptId='teacher')`;
          break;
        }
        case "2": {
          sqlStr += ` (acceptId='${params.acceptId}'||acceptId='admin')`;
          break;
        }
        case "3": {
          sqlStr += ` (acceptId='${
            params.acceptId
          }'||acceptId='admin'||acceptId='director')`;
          break;
        }
      }
    }
    console.log(sqlStr);
    return _.query(sqlStr);
  },
  // 分页查询
  getByPage(params) {
    let sqlStr = `select * from notice`;
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
        if (arr[0] !== "identity" && arr[0] !== "acceptId") {
          sqlStr += ` ${arr[0]}='${arr[1]}' and`;
        }
      });
      switch (params.identity) {
        case "0": {
          sqlStr += ` (acceptId='${params.acceptId}'||acceptId='student')`;
          break;
        }
        case "1": {
          sqlStr += ` (acceptId='${params.acceptId}'||acceptId='teacher')`;
          break;
        }
        case "2": {
          sqlStr += ` (acceptId='${params.acceptId}'||acceptId='admin')`;
          break;
        }
        case "3": {
          sqlStr += ` (acceptId='${
            params.acceptId
          }'||acceptId='admin'||acceptId='director')`;
          break;
        }
      }
    }
    sqlStr += ` order by updateTime desc limit ${(pagination.pageNum - 1) *
      pagination.pageSize},${pagination.pageSize}`;
    return _.query(sqlStr);
  },
  // 删除所选通知
  deleteById(id) {
    return _.query($sqlQuery.deleteById, id);
  },
  // 修改通知
  update(params) {
    const id = params.id;
    const queryParams = Object.entries(params);
    let sqlStr = `update notice set `;
    queryParams.forEach(element => {
      if (element[0] !== "updateTime") {
        sqlStr += `${element[0]}='${element[1]}',`;
      }
    });
    const time = getCurrentTime();
    sqlStr += `updateTime='${time}' where id='${id}'`;
    return _.query(sqlStr);
  },
  addNotice(params) {
    const id = getUuid();
    const time = getCurrentTime();
    return _.query($sqlQuery.add, [
      id,
      params.sendId,
      params.acceptId,
      params.content,
      params.state,
      params.type,
      params.targetId,
      time
    ]);
  }
};
