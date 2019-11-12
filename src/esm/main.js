import Banner from '../components/Banner.svelte'

function attachBanner(target, props = {}) {
  new Banner({
    target,
    props
  })
}

export default attachBanner
