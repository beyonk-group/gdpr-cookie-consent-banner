if (typeof window.crypto === 'undefined') {
  window.crypto = require('crypto')
}

if (!('randomUUID' in window.crypto)) {
  // https://stackoverflow.com/a/2117523/2800218
  // LICENSE: https://creativecommons.org/licenses/by-sa/4.0/legalcode
  window.crypto.randomUUID = function randomUUID() {
    return (
      [ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
      c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}
