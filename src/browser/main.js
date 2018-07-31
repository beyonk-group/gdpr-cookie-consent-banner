'use strict'

import Banner from '../components/banner.svelte'

function attachBanner (target, data = {}) {
  const banner = new Banner({
    target,
    data
  })
}

window.GdprConsent = window.GdprConsent || {}
window.GdprConsent.attachBanner = attachBanner