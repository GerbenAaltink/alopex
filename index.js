const Database = require('sqlite-async')
const TableProxy = require('./proxy')

/**
 * Create new connection to database.
 *
 * By accessing an attribute an existing table will be returned
 * or a new one will be created.
 *
 * See table class about how to do CRUD operations
 *
 * @example
 * // Memory database
 * const dataSet = await connect()
 * const pk = await dataSet.myNewTableName.insert({'myNewColumnName': 'data'})
 *
 * @example
 * // File database
 * const dataSet = await connect('mydb.sqlite')
 * const pk = await dataSet.myNewTableName.insert({'myNewColumnName': 'data'})
 *
 * @param {string} [name=":memory:"]
 * @returns {Object} new Alopex instance.
 */
function connect (name) {
  const dbName = name || ':memory:'
  return Database.open(dbName).then((db) => {
    db.dbName = dbName
    return new Proxy(db, TableProxy)
  })
}

module.exports = connect
