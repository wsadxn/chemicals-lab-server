// 用户相关的CRUD操作
const user = {
    queryById: 'select * from users where id=? and password=?',
    getUserInfo: 'select id, name, identity,tel, email from users where id=?',
    deleteById: 'delete from users where id=?',
};

const chemicals = {
    deleteById: 'delete from chemicals where id=?',
    checkCode: 'select * from chemicals where code=? and id!=?',
    getChemicalSd: 'select id,name from chemicals',
    getChemicalsNum:'select id,number from chemicals',
}

const instrument = {
    deleteById: 'delete from instrument where id=?',
    checkCode: 'select * from instrument where code=? and id!=?',
    getInstrumentSd: 'select id,name from instrument',
    getInstrumentNum:'select id,number from instrument',
}

const purchase = {
    getExistCount: 'select count(*) from purchase where type=? and itemId=? and state!=-1 && state!=2',
}

const notice = {
    add: 'insert into notice set id=?,sendId=?,acceptId=?,content=?,state=?,type=?,targetId=?,updateTime=?',
    deleteById: 'delete from notice where id=?',
}

const inform = {
    deleteById: 'delete from inform where id=?',
}

module.exports = {
    user,
    chemicals,
    instrument,
    purchase,
    notice,
    inform,
};