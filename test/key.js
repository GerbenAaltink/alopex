const assert = require('assert');
const Key = require('../key')

describe('Key',()=>{
    describe('name only', ()=> {
        const key = new Key('id')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'eq')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == '=')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" = ?')
        })
    })
    describe('__eq if __non_existing', ()=> {
        const key = new Key('id__not_existing_filter')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'eq')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == '=')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" = ?')
        })
    })
    describe('__Gt (support for uppercase filter)', ()=> {
        const key = new Key('id__Gt')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'gt')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == '>')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" > ?')
        })
    })
    describe('__eq', ()=> {
        const key = new Key('id__eq')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'eq')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == '=')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" = ?')
        })
    })
    describe('__like', ()=> {
        const key = new Key('id__like')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'like')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == 'LIKE')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" LIKE ?')
        })
    })
    describe('__gt', ()=> {
        const key = new Key('id__gt')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'gt')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == '>')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" > ?')
        })
    })
    describe('__gte', ()=> {
        const key = new Key('id__gte')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'gte')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == '>=')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" >= ?')
        })
    })
    describe('__lt', ()=> {
        const key = new Key('id__lt')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'lt')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == '<')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" < ?')
        })
    })
    describe('__lte', ()=> {
        const key = new Key('id__lte')

        it('Has correct filter', ()=>{
            assert.ok(key.filter == 'lte')
        })
        it('Has correct operator', ()=>{
            assert.ok(key.operator == '<=')
        })
        it('Has correct name', ()=>{
            assert.ok(key.name == 'id')
        })
        it('Has correct string', ()=>{
            assert.ok(key.string == '"id" <= ?')
        })
    })
})
