import Banner from '../components/banner.svelte'

function attachBanner(target, props = {}) {
  const banner = new Banner({
    target,
    props
  })
}

window.GdprConsent = window.GdprConsent || {}
window.GdprConsent.attachBanner = attachBanner
