import Banner from '../components/banner.svelte'

function attachBanner(target, props = {}) {
  new Banner({
    target,
    props
  })
}

export default attachBanner
