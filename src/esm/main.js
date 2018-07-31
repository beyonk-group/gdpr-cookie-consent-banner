'use strict'

import Banner from '../components/banner.svelte'

function attachBanner (target, data = {}) {
  const banner = new Banner({
    target,
    data
  })
}

export { attachBanner }