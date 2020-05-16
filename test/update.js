const assert = require('assert')
const connect = require('..')

describe('Update', async () => {
    let dataSet = null
    beforeEach(async () => {
        dataSet = await connect()
    })

    describe('No records available', async () => {
        it('returns zero as update count', async () => {
            assert.ok(0 == await dataSet.updateTest.update({ 'name': 'test' }))
        })
    })
    describe('Records available but no matches with field array', async () => {
        it('returns zero as update count', async () => {
            await dataSet.updateTest.insert({ 'name': 'test' })
            assert.ok(0 == await dataSet.updateTest.update({ 'name': 'test2' }, ['name']))
        })
    })
    describe('Records available and match with field array', async () => {
        it('returns zero as update count', async () => {
            await dataSet.updateTest.insert({ 'name': 'test' })
            await dataSet.updateTest.insert({ 'name': 'test' })
            await dataSet.updateTest.insert({ 'name': 'test' })
            assert.ok(1 == await dataSet.updateTest.update({ 'id': 2, 'name': 'test' }, ['id']))
        })
    })
    describe('Records available and match with criteria', async () => {
        it('returns zero as update count', async () => {
            await dataSet.updateTest.insert({ 'name': 'test' })
            await dataSet.updateTest.insert({ 'name': 'test' })
            await dataSet.updateTest.insert({ 'name': 'test' })
            assert.ok(1 == await dataSet.updateTest.update({ 'name': 'test' }, { 'id': 3 }))
        })
    })
})
