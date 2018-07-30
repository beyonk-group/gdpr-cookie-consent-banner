'use strict'

import Banner from './components/banner.svelte'

function attachBanner (parent, data = {}) {
  const element = document.createElement('div', { id: 'gdpr-banner' })
  parent.appendChild(element)

  const banner = new Banner({
    target: element,
    data
  })
}

window.GdprConsent = window.GdprConsent || {}
window.GdprConsent.attachBanner = attachBanner

export default attachBanner