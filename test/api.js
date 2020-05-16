const assert = require('assert')
const connect = require('..')

describe('API', async () => {
    const dataSet = await connect()
    describe('table', () => {
        it('has correct name', () => {
            assert.ok(dataSet.myTable.name == 'myTable')
        })
        it('is a singleton', () => {
            assert.ok(dataSet.myTable === dataSet.myTable)
        })
    })
    describe('insert', () => {
        it('returns auto increment value', async () => {
            assert.ok(1 == await dataSet.insert.insert({ 'test': 1 }))
            assert.ok(2 == await dataSet.insert.insert({ 'test': 2 }))
        })
        it('can find inserted records', async () => {
            const records = await dataSet.insert.find()
            assert.ok(records[0].test == 1)
            assert.ok(records[0].id == 1)
            assert.ok(records[1].test == 2)
            assert.ok(records[1].id == 2)
        })
        it('has correct amount of records', async () => {
            assert.ok(await dataSet.insert.count() == 2)
        })

    })
    describe('count', () => {
        it('returns zero if no records and no filter', async () => {
            assert.ok(await dataSet.count.count() == 0)
        })
        it('returns zero if no records and filter with non existing field names', async () => {
            assert.ok(await dataSet.count.count({ nonExisting: 5 }) == 0)
        })
        it('returns correct count if matches', async () => {
            await dataSet.count.insert({ test: 1 })
            await dataSet.count.insert({ test: 2 })
            await dataSet.count.insert({ test: 3 })
            assert.ok(await dataSet.count.count({ 'test__gte': 2 }) == 2)

        })
    })
    describe('delete', () => {

        it('returns zero if no records and no filter', async () => {
            assert.ok(0 == await dataSet.delete.delete())
        })
        it('returns zero if no records and filter with non existing field names', async () => {
            assert.ok(0 == await dataSet.delete.delete({ 'nonExisting': 5 }))
        })
        it('returns zero if records and filter with non existing field names', async () => {
            await dataSet.delete.insert({ 'test': null })
            await dataSet.delete.insert({ 'test': null })
            await dataSet.delete.insert({ 'test': null })
            assert.ok(0 == await dataSet.delete.delete({ 'nonExisting': 5 }))
        })
        it('returns correct changes if records and filter matches', async () => {
            await dataSet.delete.insert({ 'test': 'delete' })
            await dataSet.delete.insert({ 'test': 'keep' })
            await dataSet.delete.insert({ 'test': 'delete' })
            assert.ok(2 == await dataSet.delete.delete({ 'test': 'delete' }))
            assert.ok(1 == await dataSet.delete.count({ 'test': 'keep' }))
        })
    })
    describe('update', () => {
        it('returns zero if no records and no filter', async () => {
            assert.ok(0 == await dataSet.update.update({ 'id': 1 }))
        })
        it('returns zero if no records and filter with non existing field names', async () => {
            assert.ok(0 == await dataSet.update.update({ 'nonExisting': 5 }))
        })
        it('returns zero if records and filter with non existing field names', async () => {
            await dataSet.update.insert({ 'test': null })
            await dataSet.update.insert({ 'test': null })
            await dataSet.update.insert({ 'test': null })
            assert.ok(0 == await dataSet.update.update({ 'test': 5 }, { 'nonExisting': 5 }))
        })
        it('returns correct changes if records and filter matches', async () => {
            await dataSet.update.insert({ 'test': 'delete' })
            await dataSet.update.insert({ 'test': 'keep' })
            await dataSet.update.insert({ 'test': 'delete' })
            assert.ok(2 == await dataSet.update.update({ 'test': 'deleted' }, { 'test': 'delete' }))
            assert.ok(1 == await dataSet.update.count({ 'test': 'keep' }))
        })
        it('return correct changes if record is updated with array as filter', async () => {
            await dataSet.update.insert({ 'test': 'update' })
            await dataSet.update.insert({ 'test': 'keep' })
            await dataSet.update.insert({ 'test': 'update' })
            assert.ok(1 == await dataSet.update.update({ 'id': 2, 'test': 'updated' }, ['id']))
            assert.ok(2 == await dataSet.update.count({ 'test': 'update' }))
        })
    })




})
