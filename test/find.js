const assert = require('assert')
const DataSet = require('..')

describe('Find method', async ()=>{
    const dataSet = await DataSet()
    
    await dataSet.table.insert({'string': 'Record 1', 'integer': 1})
    await dataSet.table.insert({'string': 'Record 0', 'integer': 0})
    await dataSet.table.insert({'string': 'Record 2', 'integer': 2})

    describe('order by integer asc', async()=>{
        const records = await dataSet.table.find(null, {'_orderBy': 'integer'})
        assert.ok(records[0].integer == 0)
    })
    describe('order by integer desc', async()=>{
        const records = await dataSet.table.find(null, {'_orderBy': '-integer'})
        assert.ok(records[0].integer == 2)
    })

    describe('_orderBy string asc', async()=>{
        const records = await dataSet.table.find(null, {'_orderBy': 'string'})
        assert.ok(records[0].string == 'Record 0')
    })
    describe('_orderBy string desc', async()=>{
        const records = await dataSet.table.find(null, {'_orderBy': '-string'})
        assert.ok(records[0].string == 'Record 2')
    })
    describe('_offset only', async()=>{
        const records = await dataSet.table.find(null, {'_offset': 1})
        assert.ok(records.length == 3)
        assert.ok(records[0].id == 1)
    })
    describe('_limit', async()=>{
        const records = await dataSet.table.find(null, {'_limit': 2})
        assert.ok(records.length == 2)
        assert.ok(records[0].id == 1)
        assert.ok(records[1].id == 2)
    })
    describe('_orderBy and _limit', async()=>{
        const records = await dataSet.table.find(null, {'_limit': 2, '_orderBy':'-id'})
        assert.ok(records[0].id == 3)
        assert.ok(records.length == 2)
    })
    describe('_orderBy and _limit and __gt', async()=>{
        const records = await dataSet.table.find(null, {'_limit': 2, '_orderBy':'-id', 'id__gt': 1})
        assert.ok(records[0].id == 3)
        assert.ok(records[0].id == 2)
        assert.ok(records.length == 2)
    })
})
