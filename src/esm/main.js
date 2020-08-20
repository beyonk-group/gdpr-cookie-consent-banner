import Banner from '../components/Banner.svelte'

function attachBanner (target, props = {}) {
  // eslint-disable-next-line no-new
  new Banner({
    target,
    props
  })
}

export default attachBanner
