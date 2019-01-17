'use strict'

exports.validate = function (choice, cookie) {
  const choices = Object.keys(choice)
  const chosen = Object.keys(cookie.choices)

  if (chosen.length !== choices.length) {
    return false
  }

  return chosen.every(c => choices.includes(c))
}
