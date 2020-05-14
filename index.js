const Database = require('sqlite-async')
const TableProxy = require('./proxy')

/**
 * @param {string} name optional. :memory: is default if none given
 * @returns new Alopex instance
 */
async function connect(name){
    let dbName = name || ':memory:'
    const db = await Database.open(dbName)
    db.dbName = dbName
    return new Proxy(db, TableProxy)
}

module.exports = connect
