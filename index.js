const Database = require('sqlite-async')
const TableProxy = require('./proxy')


async function connect(name){
    let dbName = name || ':memory:'
    const db = await Database.open(dbName)
    db.dbName = dbName
    return new Proxy(db, TableProxy)
}

module.exports = connect
