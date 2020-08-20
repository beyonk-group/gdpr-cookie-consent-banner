import Banner from '../components/Banner.svelte'

function attachBanner (target, props = {}) {
  // eslint-disable-next-line no-new
  new Banner({
    target,
    props
  })
}

window.GdprConsent = window.GdprConsent || {}
window.GdprConsent.attachBanner = attachBanner
