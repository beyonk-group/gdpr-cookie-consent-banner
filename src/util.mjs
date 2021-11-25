export function validate (choice, cookieChoices) {
  const choices = Object.keys(choice)
  const chosen = Object.keys(cookieChoices)

  if (chosen.length !== choices.length) {
    return false
  }

  return chosen.every(c => choices.includes(c))
}
