import Banner from '../components/banner.svelte'

function attachBanner(target, props = {}) {
  new attachBanner({
    target,
    props
  })
}

window.GdprConsent = window.GdprConsent || {}
window.GdprConsent.attachBanner = attachBanner
