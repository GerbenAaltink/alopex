const connect = require('..')
const assert = require('assert')

describe('Connect (main module)', ()=>{
    describe('no name provided', ()=>{
        it('dbName defaults to :memory:', async() => {
            db = await connect()
            assert.ok(db.dbName == ':memory:')
        })
    })
    describe('null as name provided', ()=>{
        it('dbName defaults to :memory:', async() => {
            db = await connect(null)
            assert.ok(db.dbName == ':memory:')
        })
    })
    describe('empty string as name provided', ()=>{
        it('dbName defaults to :memory:', async() => {
            db = await connect('')
            assert.ok(db.dbName == ':memory:')
        })
    })
    describe('valid name provided', ()=>{
        it('dbName equals given value', async() => {
            db = await connect('unittest.db')
            assert.ok(db.dbName == 'unittest.db')
        })
    })
})
