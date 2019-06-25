'use strict'

const { expect } = require('@hapi/code')
const { validate } = require('./util')

describe('util', () => {
  describe('#validate(choice, cookie)', () => {
    it('choices made match available choices', () => {
      const cookie = { choices: { foo: true, bar: false, baz: true } }
      const choice = { foo: true, bar: true, baz: true }
      expect(
        validate(choice, cookie)
      ).to.equal(true)
    })

    it('user has fewer choices', () => {
      const cookie = { choices: { foo: true, bar: false } }
      const choice = { foo: true, bar: true, baz: true }
      expect(
        validate(choice, cookie)
      ).to.equal(false)
    })

    it('user has more choices', () => {
      const cookie = { choices: { foo: true, bar: false, baz: true, qux: false } }
      const choice = { foo: true, bar: true, baz: true }
      expect(
        validate(choice, cookie)
      ).to.equal(false)
    })

    it('user has different choices', () => {
      const cookie = { choices: { foo: true, bar: false, baz: true } }
      const choice = { qux: true, quux: true, quuz: true }
      expect(
        validate(choice, cookie)
      ).to.equal(false)
    })
  })
})