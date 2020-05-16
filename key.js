class Key {

    constructor(name, value) {
        this.filters = {
            'eq': '=',
            'lt': '<',
            'lte': '<=',
            'gt': '>',
            'gte': '>=',
            'like': 'LIKE'
        }
        let parts = name.split('__')
        this.name = parts[0]
        this.value = value
        this.filter = (parts.length > 1 ? parts[1] : 'eq').toLowerCase()
        this.operator = this.filters[this.filter]
        if (!this.operator) {
            this.operator = '='
            this.filter = 'eq'
        }
        this.string = `"${this.name}" ${this.operator} ?`
    }
}

module.exports = Key
