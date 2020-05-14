const Parameters = require('./parameters')

class Query {
    constructor(table, data, where)
    {
         this.table  = table
         this.db = table.db
         this.name = this.table.name
         this.data = new Parameters(data)
         this.columnString = this.data.getColumnString()
         this.assignString = this.data.getAssignString()
         this.where = new Parameters(where)
         
         this.whereString = this.where.getAssignString('AND')
         this.questionMarkString = this.data.getQuestionMarkString()
         this.values = []
        

        if(this.where.isArray)
        {
                
            this.where.keys.forEach(key=>{
                this.where.values.push(this.data.obj[key.name])
            })
        }
         this.values = this.values.concat(this.data.values)
         this.values = this.values.concat(this.where.values)
    }
    async execute()
    {
        await this.table.ensure(this.data.keyNames)
        await this.table.ensure(this.where.keyNames)
        return await this.db.run(this.getQueryString(), this.values)
    }
    async all()
    {   await this.table.ensure(this.data.keyNames)
        await this.table.ensure(this.where.keyNames)
        return await this.db.all(this.getQueryString(), this.values)
    }


}

class SelectQuery extends Query {
    getQueryString() {
        return [
            "SELECT",
            this.columnString,
            "FROM",
            `"${this.name}"`,
            this.whereString ? "WHERE" : '',
            this.whereString
        ].join(' ')
    }
    async execute() {
        return await this.all()
    }

}


class UpdateQuery extends Query {
    getQueryString() {
        return [
            'UPDATE',
            `"${this.name}"`,
            'SET',
            `${this.assignString}`,
            this.where.keys.length != 0 ? "WHERE" : '',
            this.where.keys.length != 0 ? this.whereString : ''
        ].join(' ')
    }
    async execute(){
        const result = await super.execute()
        return result.changes 
    }

}

class DeleteQuery extends Query {
    getQueryString() {
        return [
            'DELETE',
            "FROM",
            `"${this.name}"`,
            this.where.keys.length != 0 ? "WHERE" : '',
            this.where.keys.length != 0 ? this.whereString : ''
        ].join(' ')
    }
    async execute()
    {
        const result = await super.execute()
        return result.changes
    }

}


class CountQuery extends Query {
    getQueryString() {
        return [
            "SELECT",
            'count(0) as "count"',
            "FROM",
            `"${this.name}"`,
            this.where.keys.length != 0 ? "WHERE" : '',
            this.where.keys.length != 0 ? this.whereString : ''
        ].join(' ')
    }
    async execute()
    {
        const result = await super.all()
        return result[0].count
    }

}


class InsertQuery extends Query {
    getQueryString() {
        return [
            "INSERT INTO",
            `"${this.name}"`,
            `(${this.columnString})`,
            "VALUES",
            `(${this.questionMarkString})`
        ].join(' ')
    }
    async execute() {
        const result = await super.execute()
        return result.lastID
    }

}

module.exports = {
    Query,
    InsertQuery,
    SelectQuery,
    CountQuery,
    DeleteQuery,
    UpdateQuery
}
