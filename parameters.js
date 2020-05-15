const Key = require('./key')

class Parameters {


    constructor(obj)
    {
        let keys = []
        this.obj = obj || {}
        this.values = []
        this.extra = {}
        this.keyNames = []
        this.values = []
        if(!Array.isArray(this.obj))
        {
            Object.entries(this.obj).forEach(entry=>{
                let key = entry[0]
                let value = entry[1]
                if(!key.startsWith('_'))
                {
                    this.keyNames.push(key)
                    this.values.push(value)
                }
            })
        }else{
            this.keyNames = this.obj
        }
        this.isArray = this.keyNames.length > this.values.length
        this.keys = []
        this.keyNames.forEach(key=>{
            this.keys.push(new Key(key))
        })
    }

    getIndexableColumnNames()
    {
        return this.keys.filter((key)=>{
            return key.filter === 'eq'
        }).map((key)=>{
            return key.name
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

