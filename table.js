const Query = require('./query')
const Parameters = require('./parameters')

class Table {
    constructor(db, name) {
        this.db = db
        this.name = name
        this.indexes = []
        this.columns = []
        this.initialized = false
    }
    insert(data) {
        const query = new Query.InsertQuery(this, data)
        return query.execute()
    }
    /**
     * Fetch multiple records to array of dicts. E.g: [{id:1,name:'val'}]
     * @param {array} columnNames - E.g: ['id', 'name']
     * @param {object} where - E.g: {'id__like': '%a%'}
    */
    find(columnNames, where) {
        let query = new Query.SelectQuery(this, columnNames, where)
        return query.execute()
    }
    /**
     * Fetch one record to object. E.g: {id:1,name:'val'}.
     * returns null if no matches
     * @param {array} columnNames - E.g: ['id', 'name']
     * @param {object} where - E.g: {'id': 1}
    */
    findOne(columnNames, where) {
        let whereCriteria = where ? where : {}
        whereCriteria['_limit'] = 1
        let query = new Query.SelectQuery(this, columnNames, where)
        return query.execute().then(rows => {
            return rows[0]
        })
    }
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
        params.keys.forEach(key => {
            if (this.columns.indexOf(key.name) == -1) {
                promises.push(this.addColumn(key.name))
            }
        })
        if (promises.length)
            await Promise.all(promises)

        return this
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
