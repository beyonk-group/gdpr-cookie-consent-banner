'use strict'

import Banner from './components/banner.svelte'

const element = document.createElement('div', { id: 'gdpr-banner' })
const banner = new Banner({
  target: element
})

window.GdprConsent = window.GdprConsent || {}
window.GdprConsent.attachBanner = function (parent) {
  parent.appendChild(element)
}