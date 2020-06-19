const assert = require('assert')
const connect = require('..')

describe('Upsert', async () => {
    let dataSet = null
    beforeEach(async () => {
        dataSet = await connect()
    })

    describe('No match', async () => {
        it('returns id if inserted', async () => {
            assert.ok(1 === await dataSet.upsert.upsert({'test': 3}, ['test']))
        })
    })
    describe('Match', async () => {
        it('returns true if updated', async () => {
            assert.ok(1 === await dataSet.upsert.upsert({'test': 3}, ['test']))
 
            assert.ok(true === await dataSet.upsert.upsert({'test': 3}, ['test']))
        })
    })
})
