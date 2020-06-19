const Parameters = require('./parameters')
const Extra = require('./extra')

class Query {
  constructor (table, data, where) {
    this.table = table
    this.db = table.db
    this.name = this.table.name
    this.data = new Parameters(data)
    this.columnString = this.data.getColumnString()
    this.assignString = this.data.getAssignString()
    this.where = new Parameters(where)

    this.whereString = this.where.getAssignString(' AND ')
    this.questionMarkString = this.data.getQuestionMarkString()

    this.extra = new Extra(where)
    this.extraString = this.extra.string

    this.values = this.data.values

    if (this.where.isArray) {
      this.where.keys.forEach(key => {
        this.values.push(this.data.obj[key.name])
      })
    }else{
        this.values = this.values.concat(this.where.getValues())
    }
  }

  async execute () {
      return new Promise(async (resolve, reject)=> {
        await this.table.ensure(this.data.keyNames)
        await this.table.ensure(this.where.keyNames)
          this.db.run(this.getQueryString(), this.values)
              .then(resolve)
              .catch(error=>{
                console.error(error)
                console.error(this.getQueryString())
                console.error(this.values)
                reject(error)
              })
            
      })
    }

  all () {
    return new Promise(async (resolve, reject)=> {
        await this.table.ensure(this.data.keyNames)
        await this.table.ensure(this.where.keyNames)
        await this.table.ensureIndex(this.where.getIndexableColumnNames())
        this.db.all(this.getQueryString(), this.values)
            .then(resolve)
            .catch(error=>{
                console.error(error)
                console.error(this.getQueryString())
                console.error(this.values)
                reject(error)
            })
    })
  }
}

class SelectQuery extends Query {
  getQueryString () {
    return [
      'SELECT',
      this.columnString,
      'FROM',
            `"${this.name}"`,
            this.whereString ? 'WHERE' : '',
            this.whereString,
            this.extraString
    ].join(' ')
  }

  async execute () {
    return await this.all()
  }
}

class UpdateQuery extends Query {
  getQueryString () {
    return [
      'UPDATE',
            `"${this.name}"`,
            'SET',
            `${this.assignString}`,
            this.where.keys.length !== 0 ? 'WHERE' : '',
            this.where.keys.length !== 0 ? this.whereString : ''
    ].join(' ')
  }

  async execute () {
    const result = await super.execute()
    return result.changes
  }
}

class DeleteQuery extends Query {
  getQueryString () {
    return [
      'DELETE',
      'FROM',
            `"${this.name}"`,
            this.where.keys.length !== 0 ? 'WHERE' : '',
            this.where.keys.length !== 0 ? this.whereString : ''
    ].join(' ')
  }

  async execute () {
    const result = await super.execute()
    return result.changes
  }
}

class CountQuery extends Query {
  getQueryString () {
    return [
      'SELECT',
      'count(0) as "count"',
      'FROM',
            `"${this.name}"`,
            this.where.keys.length !== 0 ? 'WHERE' : '',
            this.where.keys.length !== 0 ? this.whereString : ''
    ].join(' ')
  }

  async execute () {
    const result = await super.all()
    return result[0].count
  }
}

class InsertQuery extends Query {
  getQueryString () {
    return [
      'INSERT INTO',
            `"${this.name}"`,
            `(${this.columnString})`,
            'VALUES',
            `(${this.questionMarkString})`
    ].join(' ')
  }

  async execute () {
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
