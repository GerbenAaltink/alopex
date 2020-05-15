const assert = require('assert')
const Extra = require('../extra')

describe('Extra', ()=>
{
    describe('_orderBy ascending', ()=>{
        const extra = new Extra({'_orderBy': 'id'})
        it('has correct string', ()=>{
            assert.ok(extra.string == 'ORDER BY "id" ASC')
        })
    })
     describe('_orderBy descending', ()=>{
            const extra = new Extra({'_orderBy': '-id'})
            it('has correct string', ()=>{
                assert.ok(extra.string == 'ORDER BY "id" DESC')
            })
        })
        describe('_offset only is not allowed', ()=>{
            const extra = new Extra({'_offset': 10})
            it('has correct string', ()=>{
                assert.ok(extra.string == '')
            })
        })
         describe('_limit without offset', ()=>{
            const extra = new Extra({'_limit': 10})
            it('has correct string with OFFSET 0', ()=>{
                assert.ok(extra.string == 'LIMIT 10 OFFSET 0')
            })
        })
        describe('_limit with _offset', ()=>{
            const extra = new Extra({'_limit': 10, '_offset': 10})
            it('has correct string', ()=>{
                assert.ok(extra.string == 'LIMIT 10 OFFSET 10')
            })
        })
})
