const _ = require('./query');
const $sqlQuery = require('./sqlCRUD').user;
const getCurrentTime = require("../libs/utils").getCurrentTime;


module.exports = {
    // 获取分页查询总记录数
  getCount(params) {
    let sqlStr = `select count(*) from users`;
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
        } else if (arr[0] === "id") {
          sqlStr +=
            ` id like '${"%" + arr[1] + "%"}'` +
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
    let sqlStr = `select id,name,identity,tel,email from users`;
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
        } else if (arr[0] === "id") {
          sqlStr +=
            ` id like '${"%" + arr[1] + "%"}'` +
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
    // 登录校验
    checkPerson(person) {
        return _.query($sqlQuery.queryById, [person.pid, person.pwd]);
    },
    // 更新用户信息
    updateUserInfo: function (userInfo) {
        const id = userInfo.id;
        userInfo.updateTime = getCurrentTime();
        const queryParams = Object.entries(userInfo);
        let sqlStr = `update users set `;
        queryParams.forEach((element, index) => {
          if(element[0] !== 'type'){
            sqlStr += `${element[0]}='${element[1]}'` + (index === queryParams.length - 1 ? '': ',');
          }
        });
        return _.query(sqlStr + ` where id=${id}`);          
    },
    deleteById(UserId) {
      return _.query($sqlQuery.deleteById, UserId);
    },
    // 获取用户信息
    getUserInfo: function (userId) {
        return _.query($sqlQuery.getUserInfo, userId);
    },
    getUserSd: function (params) {
        const identity = params.identity || '';
        let sqlStr = `select id,name from users`;
        if(identity){
            sqlStr += ` where `;
            for(let i = 0; i < identity.length; i++){
                if(i === identity.length - 1){
                    sqlStr += `identity=${identity[i]}`;
                }else{
                    sqlStr += `identity=${identity[i]}||`;
                }
            }
        }
        return _.query(sqlStr);
    },
};
