const _ = require("./query");
const $sqlQuery = require("./sqlCRUD").instrument;
const getUuid = require("../libs/utils").getUuid;
const getCurrentTime = require("../libs/utils").getCurrentTime;

module.exports = {
  // 获取分页查询总记录数
  getCount(params) {
    let sqlStr = `select count(*) from instrument`;
    delete params["pageNum"];
    delete params["pageSize"];
    const queryParams = Object.entries(params);

    if (queryParams.length > 0) {
      sqlStr += ` where`;
      queryParams.forEach(function(arr, index) {
        if (arr[0] === "name") {
          sqlStr +=
            ` name like '${"%" + arr[1] + "%"}'` +
            (index === queryParams.length - 1 ? "" : " and");
        } else if (arr[0] === "code") {
          sqlStr +=
            ` code like '${"%" + arr[1] + "%"}'` +
            (index === queryParams.length - 1 ? "" : " and");
        } else if (arr[0] === "status") {
          if (arr[1] === "0") {
            sqlStr +=
              ` number-threshold<0` +
              (index === queryParams.length - 1 ? "" : " and");
          } else if (arr[1] === "1") {
            sqlStr +=
              ` number-threshold<10` +
              (index === queryParams.length - 1 ? "" : " and");
          } else {
            sqlStr +=
              ` number-threshold>=10` +
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
    let sqlStr = `select * from instrument`;
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
        if (arr[0] === "name") {
          sqlStr +=
            ` name like '${"%" + arr[1] + "%"}'` +
            (index === queryParams.length - 1 ? "" : " and");
        } else if (arr[0] === "code") {
          sqlStr +=
            ` code like '${"%" + arr[1] + "%"}'` +
            (index === queryParams.length - 1 ? "" : " and");
        } else if (arr[0] === "status") {
          if (arr[1] === "0") {
            sqlStr +=
              ` number-threshold<0` +
              (index === queryParams.length - 1 ? "" : " and");
          } else if (arr[1] === "1") {
            sqlStr +=
              ` number-threshold<10` +
              (index === queryParams.length - 1 ? "" : " and");
          } else {
            sqlStr +=
              ` number-threshold>=10` +
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
  // 删除所选仪器
  deleteById(instrumentId) {
    return _.query($sqlQuery.deleteById, instrumentId);
  },
  // 验证仪器编码是否重复
  checkCode(params) {
    return _.query($sqlQuery.checkCode, [params.code, params.id]);
  },
  // 修改仪器信息
  updateInstrument(params) {
    const id = params.id;
    const queryParams = Object.entries(params);
    let sqlStr = `update instrument set `;
    queryParams.forEach(element => {
      if (element[0] !== "updateTime") {
        sqlStr += `${element[0]}='${element[1]}',`;
      }
    });
    const time = getCurrentTime();
    sqlStr += `updateTime='${time}' where id='${id}'`;
    return _.query(sqlStr);
  },
  // 新增仪器信息
  addInstrument(params) {
    const info = {
      ...params
    };
    info.id = getUuid();
    const queryParams = Object.entries(info);
    let sqlStr = `insert into instrument set `;
    queryParams.forEach(element => {
      sqlStr += `${element[0]}='${element[1]}',`;
    });
    const time = getCurrentTime();
    sqlStr += `updateTime='${time}'`;
    return _.query(sqlStr);
  },
  getInstrumentSd() {
    return _.query($sqlQuery.getInstrumentSd);
  },
  getInstrumentNum() {
    return _.query($sqlQuery.getInstrumentNum);
  },
  updateNumber(params){
    const sqlStr = `update instrument set number=number+${params.number} where id='${params.id}'`;
    console.log(sqlStr);
    return _.query(sqlStr);
  },
};
