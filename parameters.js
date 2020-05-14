const Key = require('./key')

class Parameters {

    constructor(obj)
    {
        let keys = []
        this.obj = obj || {}
        this.values = []

        if(!Array.isArray(this.obj))
        {
            this.keyNames = Object.keys(this.obj)
            this.values = Object.values(this.obj)
        }else{
            this.keyNames = this.obj
        }
        this.isArray = this.keyNames.length > this.values.length
        this.keys = []
        this.keyNames.forEach(key=>{
            this.keys.push(new Key(key))
        })
    }
    getAssignString(glue) {
        let result = []
        this.keys.forEach(key=>{
            result.push(key.string)
        })
        return result.join(glue || ', ') 
    }
    getColumnString() {
        if(this.keys.length === 0)
            return "*"
        return '"' + this.keyNames.join('","') + '"'
    }
    getQuestionMarkString(){
        let questionMarks = []
        this.keys.forEach(()=>{
            questionMarks.push('?')
        })
        return questionMarks.join(',')
    }
}

module.exports = Parameters

