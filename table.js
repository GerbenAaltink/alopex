const Query = require('./query')
const Parameters = require('./parameters')

/**
 * Represents a table.
 * 
 * A table will be initialized after first crud operation.
 * This can be an existing one or a new one.
 * 
 * Missing fields specified in select / where clause are atomatically created.
 * Missing indexes specified in where clause are automatically created.
 * 
 * @property {string[]} column column names
 * @property {string[]} indexes index names
 * @property {string} name table name
 * @property {Object} db sqlite-async connection instance
 * @property {bool} initialized is true if table exists, columns are loaded and indexes are loaded
 */
class Table {

    constructor(db, name) {
        this.db = db
        this.name = name
        this.indexes = []
        this.columns = []
        this.initialized = false
    }
    /**
     * Creates new record. Supported field types:
     *  - string
     *  - integer
     *  - boolean will be converted to int
     *  - date will be converted to string 
     * 
     * @example
     * console.info('Created pk', await this.insert({'stringColumn': 'value', 'numberColumn': 5}})
     * 
     * @param {Object} {'columnName':'value'}
     * @returns {number} primary key of created record
     */
    insert(data) {
        const query = new Query.InsertQuery(this, data)
        return query.execute()
    }
    /**
     * Find multiple records
     * 
     * @example 
     * await this.find({
     *      'id__gte': 5, 
     *      'name__like': '%John', 
     *      '_orderBy': '-id',
     *      '_limit': 50,
     *      '_offset': 10
     * })
     * 
     * @param {Array} [columnNames=null] - E.g: ['id', 'name']
     * @param {Object} [where=null] - E.g: {'id__like': '%a%'}
     * @returns {Object[]} Array of found records
    */
    find(columnNames, where) {
        let query = new Query.SelectQuery(this, columnNames, where)
        return query.execute()
    }
    /**
     * Find one record
     * 
     * @example
     * await this.findOne({
     *      'name': 'John'
     * }))
     * 
     * @param {string[]} [columnNames=*] 
     * @param {Object} [where={}] - E.g: {'id': 1}
     * @returns {Object} Record
     * @returns {null} if no matches
    */
    findOne(columnNames, where) {
        let whereCriteria = where ? where : {}
        whereCriteria['_limit'] = 1
        let query = new Query.SelectQuery(this, columnNames, where)
        return query.execute().then(rows => {
            return rows[0]
        })
    }
    /**
     * 
     * @example <caption>Update with column name array as where clause</caption>
     * const changedRecordCount = await this.update({
     *      'id': 1
     *      'name': 'John'
     * },['id'])
     * 
     * @example <caption>Update with string as where clause</caption>
     * const changedRecordCount = await this.update({
     *      'id': 1
     *      'name': 'John'
     * },'id')
     * 
     * @example <caption>Update with object as where clause</caption>
     * const changedRecordCount = await this.update({
     *      'id': 1
     *      'name': 'John'
     * },{'id': 1})
     * 
     * @example <caption>Update without where clause</caption>
     * // Update with no where clause
     * const changedRecordCount = await this.update({
     *      'id': 1
     *      'name': 'John'
     * })
     * 
     * @param {Object} data record 
     * @param {Object} where values that should match
     * @param {string[]} where field names of values that should match
     */
    update(data, where) {
        // returns update count 
        const query = new Query.UpdateQuery(this, data, where)
        return query.execute()
    }
    delete(where) {
        // returns deleted count 
        const query = new Query.DeleteQuery(this, null, where)
        return query.execute()
    }
    upsert(data, where) {
        // returns true if updated, else new primary key
        this.update(data, where).then(changeCount => {
            return changeCount ? true : this.insert(data)
        })
    }
    count(where) {
        const query = new Query.CountQuery(this, null, where)
        return query.execute()
    }
    ensureIndex(names) {
        return new Promise((resolve, reject) => {
            if (names.length < 2)
                return resolve(false)
            names.sort()
            let indexName = 'idx_' + names.join('_')
            if (this.indexes.indexOf(indexName) !== -1) {
                return resolve(false)
            }
            let nameString = names.join(',')

            let query = [
                'CREATE INDEX',
                indexName,
                'ON',
                `"${this.name}"`,
                `(${nameString})`
            ].join(' ')
            this.indexes.push(indexName)
            this.db.run(query, []).then(resolve)

        })

    }
    async ensure(obj) {
        if (!this.initialized) {
            this.initialized = true
            await this.createTable()
            this.columns = await this.getColumns()
            this.indexes = await this.getIndexes()
        }
        obj = obj || {}
        let params = new Parameters(obj)
        let promises = []
        params.keys.filter(
            key=>this.columns.indexOf(key.name) === -1
        ).map((key)=>{
            promises.push(this.addColumn(key.name))
        })
        
        return Promise.all(promises)
    }

    createTable() {
        return this.db.run(`CREATE TABLE IF NOT EXISTS "${this.name}" (id INTEGER PRIMARY KEY)`)
    }
    async getColumns() {
        let result = await this.db.all('SELECT name FROM PRAGMA_TABLE_INFO(?)', [this.name])
        let names = []
        result.forEach(row => {
            names.push(row.name)
        })
        return names
    }
    getIndexes() {
        return this.db.all('select name FROM sqlite_master WHERE tbl_name = ? AND type="index"', [this.name]).then(indexes => {
            return indexes.map((row) => {
                return row.name
            })
        })

    }
    async addColumn(name) {
        let query = [
            'ALTER TABLE',
            `"${this.name}"`,
            "ADD COLUMN ",
            `"${name}";`
        ].join(' ')
        this.columns.push(name)
        return this.db.run(query, [])

    }
}

module.exports = Table
