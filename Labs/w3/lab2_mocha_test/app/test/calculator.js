const assert  = require('assert')
const { add,mul,div,sub } = require('../calculator.js')

describe('Calculator tests', ()=>{
    describe('Addition', ()=>{
        it('add(5,3) should equal 8', ()=>{
            const res = add(5,3)
            assert.strictEqual(res,8)
        })
        it('add(5,3) should not equal 10', ()=>{
            const res = add(5,3)
            assert.strictEqual(res,10)
        })
    })
    describe('Subtraction', ()=>{
        it('sub(5,3) should equal 2', ()=>{
            const res = sub(5,3)
            assert.strictEqual(res,2)
        })
        it('sub(5,3) should not equal 0', ()=>{
            const res = sub(5,3)
            assert.strictEqual(res,0)
        })
    })
    describe('Multiplication', ()=>{
        it('mul(5,3) should equal 15', ()=>{
            const res = mul(5,3)
            assert.strictEqual(res,15)
        })
        it('mul(5,3) should not equal 20', ()=>{
            const res = mul(5,3)
            assert.strictEqual(res,20)
        })
    })
    describe('Division', ()=>{
        it('div(6,3) should equal 2', ()=>{
            const res = div(6,3)
            assert.strictEqual(res,2)
        })
        it('div(6,3) should not equal 1', ()=>{
            const res = div(6,3)
            assert.strictEqual(res,1)
        })
    })
})