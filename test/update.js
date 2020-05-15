const assert = require('assert')
const connect = require('..')

describe('Update', async()=>{

    describe('No records available', async()=>{
        const dataSet = await connect()
        it('returns zero as update count', async()=>{
            assert.ok(0 == await dataSet.updateTest.update({'name': 'test'}))
        })
    })
    describe('Records available but no matches with field array', async()=>{
        const dataSet = await connect()
        await dataSet.updateTest.insert({'name': 'test'})
        it('returns zero as update count', async()=>{
            assert.ok(0 == await dataSet.updateTest.update({'name': 'test2'}, ['name']))
        })
    })
    describe('Records available and match with field array', async()=>{
        const dataSet = await connect()
        await dataSet.updateTest.insert({'name': 'test'})
        await dataSet.updateTest.insert({'name': 'test'})
        await dataSet.updateTest.insert({'name': 'test'})
        it('returns zero as update count', async()=>{
            assert.ok(1 == await dataSet.updateTest.update({'id': 2, 'name': 'test'}, ['id']))
        })
    })
    describe('Records available and match with criteria', async()=>{
        const dataSet = await connect()
        await dataSet.updateTest.insert({'name': 'test'})
        await dataSet.updateTest.insert({'name': 'test'})
        await dataSet.updateTest.insert({'name': 'test'})
        it('returns zero as update count', async()=>{
            assert.ok(1 == await dataSet.updateTest.update({'name': 'test'}, {'id': 3}))
        })
    })
})
