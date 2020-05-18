const Table = require('./table')

const proxy = {
  /**
     * Magic getter
     *
     * Returns singleton of a Table instance
     *
     * @param {Object} obj async-sqlite Database object
     * @param {string} prop attributeName
     * @returns {Object} singleton of new or existing table.
     */
  get: function (obj, prop) {
    if (obj[prop] === undefined) {
      obj[prop] = new Table(obj, prop)
    }
    return obj[prop]
  }

}

module.exports = proxy
