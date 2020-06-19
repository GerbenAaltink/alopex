class Key {
  constructor (name, value) {
    this.filters = {
      eq: '=',
      lt: '<',
      lte: '<=',
      gt: '>',
      gte: '>=',
      like: 'LIKE',
      isnull: null
    }
    const parts = name.split('__')
    this.name = parts[0]
    this.value = value
    this.filter = (parts.length > 1 ? parts[1] : 'eq').toLowerCase()
    this.isParameter = this.filter !== 'isnull' 
    this.operator = this.filters[this.filter]
    if (this.operator === undefined) {
      this.operator = '='
      this.filter = 'eq'
    }
    if (this.isParameter)
    {
        this.string = `"${this.name}" ${this.operator} ?`
    }else
    {
        if(this.value === false)
        {
            this.string = `"${this.name}" IS NOT NULL`
        }else{
            this.string = `"${this.name}" IS NULL` 
        }
    }
  }
}

module.exports = Key
