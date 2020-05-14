const Table = require('./table')

const proxy = {
    get: function(obj, prop)
    {
        if(obj[prop] == undefined)
        {
            obj[prop] = new Table(obj, prop)
        }
        return obj[prop]
    }

}

module.exports = proxy 
