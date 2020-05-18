const Key = require('./key')

/**
 * Parameter wrapper
 */
class Parameters {
  /**
     * @param {string} [obj=null] "columnName"
     * @param {object} [obj=null] {'column1': 1, 'column2': 2}
     * @param {array} [obj=null] ['column1', 'column2']
     */
  constructor (obj) {
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
     * @param {string} obj "columnName"
     * @param {object} obj {'column1': 1, 'column2': 2}
     * @param {array} obj ['column1', 'column2']
     * @returns {array} if array or string is given
     * @returns {object} if object or null || undefined is given
     */
  normalalizeObj (obj) {
    if (!obj) { return {} }
    if (typeof (obj) === 'string') { return [obj] }
    return obj
  }

  /**
     * Columns filtered by __eq should be indexed.
     *
     * @returns {array} column names which are filtered with __eq
     */
  getIndexableColumnNames () {
    return this.keys.filter(
      (key) => key.filter === 'eq'
    ).map(
      (key) => key.name
    )
  }

  /**
     * Get assignment string to be used in SQL queries.
     *
     * @param {string} [glue=", "]
     * @returns {string} "column1" = ?, "column2" = ?
     */
  getAssignString (glue) {
    return this.keys.map(key => key.string).join(glue || ', ')
  }

  /**
     * Get column string to be used in SQL queries
     *
     * @returns {string} "*" if no fields specified. Else '"column1", "column2"'
     */
  getColumnString () {
    if (this.keys.length === 0) { return '*' }
    return '"' + this.keyNames.join('","') + '"'
  }

  /**
     * Create comma devided question mark string with same length as columns to filter
     *
     * @returns {string} "?,?,?"
     */
  getQuestionMarkString () {
    return this.keys.map(() => '?').join(',')
  }
}

module.exports = Parameters
