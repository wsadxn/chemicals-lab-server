const _ = require("./query");
const $sqlQuery = require("./sqlCRUD").chemicals;
const getUuid = require("../libs/utils").getUuid;
const getCurrentTime = require("../libs/utils").getCurrentTime;

module.exports = {
  // 获取分页查询总记录数
  getCount(params) {
    let sqlStr = `select count(*) from chemicals`;
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
          if (arr[1] === '0') {
            sqlStr +=
              ` number-threshold<0` +
              (index === queryParams.length - 1 ? "" : " and");
          } else if (arr[1] === '1') {
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
    let sqlStr = `select * from chemicals`;
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
          if (arr[1] === '0') {
            sqlStr +=
              ` number-threshold<0` +
              (index === queryParams.length - 1 ? "" : " and");
          } else if (arr[1] === '1') {
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
  // 删除所选药品
  deleteById(chemicalsId) {
    return _.query($sqlQuery.deleteById, chemicalsId);
  },
  // 验证药品编码是否重复
  checkCode(params) {
    return _.query($sqlQuery.checkCode, [params.code, params.id]);
  },
  // 修改药品信息
  updateChemicals(params) {
    const id = params.id;
    const queryParams = Object.entries(params);
    let sqlStr = `update chemicals set `;
    queryParams.forEach(element => {
      if (element[0] !== "updateTime") {
        sqlStr += `${element[0]}='${element[1]}',`;
      }
    });
    const time = getCurrentTime();
    sqlStr += `updateTime='${time}' where id='${id}'`;
    return _.query(sqlStr);
  },
  // 新增药品信息
  addChemicals(params) {
    const info = {
      ...params
    };
    info.id = getUuid();
    const queryParams = Object.entries(info);
    let sqlStr = `insert into chemicals set `;
    queryParams.forEach(element => {
      sqlStr += `${element[0]}='${element[1]}',`;
    });
    const time = getCurrentTime();
    sqlStr += `updateTime='${time}'`;
    return _.query(sqlStr);
  },
  getChemicalSd() {
    return _.query($sqlQuery.getChemicalSd);
  },
  getChemicalsNum() {
    return _.query($sqlQuery.getChemicalsNum);
  },
  updateNumber(params){
    const sqlStr = `update chemicals set number=number+${params.number} where id='${params.id}'`;
    console.log(sqlStr);
    return _.query(sqlStr);
  },
};
