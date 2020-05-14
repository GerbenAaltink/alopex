const Query = require('./query')
const Parameters = require('./parameters')

class Table {
    constructor(db, name){
        this.db = db
        this.name = name
        this.indexes = []
        this.columns = []
        this.initialized = false
    }
    async insert(data){
        const query = new Query.InsertQuery(this,data)
        return await query.execute()
    }
    /**
     * Fetch multiple records to array of dicts. E.g: [{id:1,name:'val'}]
     * @param {array} columnNames - E.g: ['id', 'name']
     * @param {object} where - E.g: {'id__like': '%a%'}
    */
    async find(columnNames, where)
    {
        let query = new Query.SelectQuery(this, columnNames, where)
        return await query.execute()
    }
    /**
     * Fetch one record to object. E.g: {id:1,name:'val'}.
     * returns null if no matches
     * @param {array} columnNames - E.g: ['id', 'name']
     * @param {object} where - E.g: {'id': 1}
    */
    async get(columnNames, where)
    {
        let query = new Query.SelectQuery(this, columnNames, where)
        return await query.execute()
    }
    async update(data, where)
    {
        // returns update count 
        const query = new Query.UpdateQuery(this, data, where)
        return await query.execute()
    }
    async delete(where)
    {
        // returns deleted count 
        const query = new Query.DeleteQuery(this, null, where)
        return await query.execute()
    }
    async upsert(data, where)
    {
        // returns true if updated, else new primary key
        if(await this.update(data, where) > 1)
            return true
        return await this.insert(data)
    }
    async count(where)
    {
        const query = new Query.CountQuery(this, null, where)
        return await query.execute()
    }
    async createIndex(names)
    {
        await this.ensure()
        names.sort()
        let indexName = names.join('_')
        if(this.indexes.indexOf(indexName) !== -1)
            return false

        let nameString = names.join(',')
        
        let query = [
            'CREATE INDEX',
            indexName,
            'ON',
            `"{this.name}"`,
            `(nameString)`
        ].join(' ')
        this.indexes.push(indexName)
        await this.db.run(query, [])
        return true
    }
    async ensure(obj)
    {
        if(!this.initialized)
        {
            this.initialized = true
            await this.createTable()
            this.columns = await this.getColumns()
        }
        obj = obj || {}
        let params = new Parameters(obj)
        let promises = []
        params.keys.forEach(key=>{
            if(this.columns.indexOf(key.name) == -1)
            {
                promises.push(this.addColumn(key.name))
            }
        })
        if(promises.length)
            await Promise.all(promises)
        return this
    }
    createTable(){
        return this.db.run(`CREATE TABLE IF NOT EXISTS "${this.name}" (id INTEGER PRIMARY KEY)`)
    }
    async getColumns() {
        let result = await this.db.all('SELECT name FROM PRAGMA_TABLE_INFO(?)', [this.name])
        let names = []
        result.forEach(row=>{
            names.push(row.name)
        })
        return names 
    }
    async addColumn(name)
    {
        let query = [
            'ALTER TABLE',
            `"${this.name}"`,
            "ADD COLUMN ",
            `"${name}";`
        ].join(' ')
        this.columns.push(name)
        return this.db.run(query,[])
        
    }
}

module.exports = Table
