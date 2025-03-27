import { validate } from './util.js'
import { test, expect } from 'vitest'

test('choices made match available choices', () => {
  const choicesFromCookie = { foo: true, bar: false, baz: true }
  const choice = { foo: true, bar: true, baz: true }
  expect(
    validate(choice, choicesFromCookie)
  ).toEqual(true)
})

test('user has fewer choices', () => {
  const choicesFromCookie = { foo: true, bar: false }
  const choice = { foo: true, bar: true, baz: true }
  expect(
    validate(choice, choicesFromCookie)
  ).toEqual(false)
})

test('user has more choices', () => {
  const choicesFromCookie = { foo: true, bar: false, baz: true, qux: false }
  const choice = { foo: true, bar: true, baz: true }
  expect(
    validate(choice, choicesFromCookie)
  ).toEqual(false)
})

test('user has different choices', () => {
  const choicesFromCookie = { foo: true, bar: false, baz: true }
  const choice = { qux: true, quux: true, quuz: true }
  expect(
    validate(choice, choicesFromCookie)
  ).toEqual(false)
})
