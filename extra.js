
class Extra {

    constructor(obj) {
        if (obj === undefined || obj === null || Array.isArray(obj))
            return

        this.criteria = []

        if (obj._orderBy) {
            let direction = obj._orderBy.startsWith('-') ? 'DESC' : 'ASC'
            let orderBy = direction == 'ASC' ? obj._orderBy : obj._orderBy.substr(1)
            this.criteria.push(`ORDER BY "${orderBy}" ${direction}`)
        }
        if (obj._limit) {
            this.criteria.push(`LIMIT ${obj._limit}`)
            if (!obj._offset) {
                this.criteria.push('OFFSET 0')
            } else {
                this.criteria.push(`OFFSET ${obj._offset}`)
            }
        }

        this.string = this.criteria.join(' ')
    }

}

module.exports = Extra
