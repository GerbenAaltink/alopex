const Key = require('./key')

class Parameters {


    /**
     * 
     * @param {string, Array, Object} obj 
     */
    constructor(obj) {
        this.obj = this.normalalizeObj(obj)

        this.values = []
        this.extra = {}
        this.keyNames = []

        if (Array.isArray(this.obj)) {
            // ['field1', 'field2'] format
            this.keyNames = this.obj
        } else {
            // {'field':'value'} format

            Object.entries(this.obj).filter(
                // Don't add fields starting with '_'. This is reserved for ordering / limit / offset.
                entry => !entry[0].startsWith('_')
            ).forEach(entry => {
                this.keyNames.push(entry[0])
                this.values.push(entry[1])
            })
        }
        this.isArray = this.keyNames.length > this.values.length
        this.keys = this.keyNames.map(key => new Key(key))
    }

    /**
     * Convert object to valid value
     * 
     * @param {*} obj may be array, object or string
     * @returns {Array, Object}
     */
    normalalizeObj(obj) {
        if (!obj)
            return {}
        if (typeof (obj) === 'string')
            return [obj]
        return obj
    }

    /**
     * Columns filtered by __eq should be indexed.
     * 
     * @returns {Array} column names which are filtered with __eq
     */
    getIndexableColumnNames() {
        return this.keys.filter(
            (key) => key.filter === 'eq'
        ).map(
            (key) => key.name
        )
    }

    /**
     * Get assignment string to be used in SQL queries.
     * E.g: "column1" = ?, "column2" = ?
     * 
     * @param {string} glue default is ', '
     * @returns {string}
     */
    getAssignString(glue) {
        return this.keys.map(key => key.string).join(glue || ', ')
    }

    /**
     * get column string to be used in SQL queries
     * 
     * @returns {string} "*" if no fields specified. Else '"column1", "column2"'
     */
    getColumnString() {
        if (this.keys.length === 0)
            return "*"
        return '"' + this.keyNames.join('","') + '"'
    }

    /**
     * Create question mark string with same length as columns to filter to be used in SQL queries
     * E.g: "?,?,?"" if you had three columns
     * 
     * @returns {string}
     */
    getQuestionMarkString() {
        return this.keys.map(() => '?').join(',')
    }
}

module.exports = Parameters

