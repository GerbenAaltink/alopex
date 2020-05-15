const Database = require('sqlite-async')
const TableProxy = require('./proxy')

/**
 * @param {string} name optional. :memory: is default if none given
 * @returns new Alopex instance
 */
function connect(name){
    let dbName = name || ':memory:'
    return Database.open(dbName).then((db)=>{
        db.dbName = dbName
        return new Proxy(db, TableProxy)
    })
}

module.exports = connect
