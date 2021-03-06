const assert = require('assert')
const connect = require('..')

describe('Find one method', async () => {
    let dataSet = null
    beforeEach(async () => {
        dataSet = await connect()
        await dataSet.table.insert({ 'string': 'Record 1', 'integer': 1, 'nullable': 'null' })
        await dataSet.table.insert({ 'string': 'Record 0', 'integer': 0, 'nullable': 'null' })
        await dataSet.table.insert({ 'string': 'Record 2', 'integer': 2, 'nullable': null  })
    })
    describe('order by integer asc', async () => {
        it('returns record in correct order', async () => {
            const record = await dataSet.table.findOne({ '_orderBy': 'integer' })
            assert.ok(record.integer == 0)
        })
    })
    describe('order by integer desc', async () => {
        it('returns record in correct order', async () => {
            const record = await dataSet.table.findOne({ '_orderBy': '-integer' })
            assert.ok(record.integer == 2)
        })
    })
    describe('_orderBy string asc', async () => {
        it('returns record in correct order', async () => {
            const record = await dataSet.table.findOne({ '_orderBy': 'string' })
            assert.ok(record.string == 'Record 0')
        })
    })
    describe('_orderBy string desc', async () => {
        it('returns record in correct order', async () => {
            const record = await dataSet.table.findOne({ '_orderBy': '-string' })
            assert.ok(record.string == 'Record 2')
        })
    })
    describe('_offset only', async () => {
        it('returns correct record', async () => {
            const record = await dataSet.table.findOne({ '_offset': 1 })
            assert.ok(record.id == 2)
        })
    })
    describe('_limit', async () => {
        it('returns record in correct order', async () => {
            const record = await dataSet.table.findOne({ '_limit': 2 })
            assert.ok(record.id == 1)
        })
    })
    describe('_orderBy and _limit', async () => {
        it('returns record in correct order', async () => {
            const record = await dataSet.table.findOne({ '_limit': 2, '_orderBy': '-id' })
            assert.ok(record.id == 3)
        })
    })
    describe('_orderBy and _limit and __gt', async () => {
        it('returns record in correct order', async () => {
            const record = await dataSet.table.findOne({ '_limit': 2, '_orderBy': '-id', 'id__gt': 1 })
            assert.ok(record.id == 3)
        })
    })
    describe('select specific field', async () => {
        it('returns specified field', async () => {
            const record = await dataSet.table.findOne({ '_limit': 2, '_orderBy': '-id', 'id__gt': 1 }, ['id'])
            assert.ok(record.id == 3)
            assert.ok(Object.keys(record).length == 1)
        })
    })
    describe('select multiple fields', async () => {
        it('returns multiple specified fields', async () => {
            const record = await dataSet.table.findOne({'_limit': 2, '_orderBy': '-id', 'id__gt': 1 }, ['string','integer'])
            assert.ok(record.integer == 2)
            assert.ok(record.string == "Record 2")
            assert.ok(Object.keys(record).length == 2)
        })
    })
    describe('__isnull=true', async()=>{
        it('returns record where __isnull=true', async() =>{
            const record = await dataSet.table.findOne({'nullable__isnull':true})
            assert.ok(record.nullable == null) 
        }) 
    })  
    describe('__isnull=false', async()=>{
        it('returns record where __isnull=false', async() =>{
            const record = await dataSet.table.findOne({'nullable__isnull':false})
            assert.ok(record.nullable == 'null') 
        }) 
    })  
    describe('cache', async () => {
        it('cache hits two times and misses once', async () => {
            await dataSet.table.findOne({ '_limit': 2, '_orderBy': '-id', 'id__gt': 1 }, ['string','integer'])
            await dataSet.table.findOne({ '_limit': 2, '_orderBy': '-id', 'id__gt': 1 }, ['string','integer'])
            const record = await dataSet.table.findOne({ '_limit': 2, '_orderBy': '-id', 'id__gt': 1 }, ['string', 'integer'])
            assert.ok(dataSet.table.cache.misses == 1)
            assert.ok(dataSet.table.cache.hits == 2)
            assert.ok(record.integer == 2)
            assert.ok(Object.keys(record).length == 2)
        })
    })
    
})
