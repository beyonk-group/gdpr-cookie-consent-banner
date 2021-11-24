## GDPR Cookie Consent banner

<p align="center">
  <img width="186" height="90" src="https://user-images.githubusercontent.com/218949/44782765-377e7c80-ab80-11e8-9dd8-fce0e37c235b.png" alt="Beyonk" />
</p>

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![CircleCI](https://circleci.com/gh/beyonk-adventures/gdpr-cookie-consent-banner.svg?style=shield)](https://circleci.com/gh/beyonk-adventures/gdpr-cookie-consent-banner) [![Svelte v3](https://img.shields.io/badge/svelte-v2-orange.svg)](https://v2.svelte.dev) [![Svelte v3](https://img.shields.io/badge/svelte-v3-blueviolet.svg)](https://svelte.dev)

### What is it?

This is a vanilla JS implementation (thanks to [Svelte](http://svelte.dev)) of a compliant GDPR banner. It allows the user granular opt-in and out of four different cookie categories.

### What are its features?

* Small, discrete, and non-intrusive
* GDPR Compliant
* Responsive
* Offers four categories
* Runs any function on opting-in
* Runs opted-in functions on each visit
* Changing the choices requires the user to opt-in again.
* Vanilla JS
* Svelte Ready
* No dependencies
* Choices expire yearly
* Optional CSS (with BEM) to bootstrap your cookie message right away
* Modifiable labels and messages

### How do I install it?

#### Via NPM

Simply install the node module into your codebase.

```bash
npm install --save-dev @beyonk/gdpr-cookie-consent-banner
```

then import the banner into your code:

```js
import attachBanner from '@beyonk/gdpr-cookie-consent-banner'
import '@beyonk/gdpr-cookie-consent-banner/dist/style.css' // import optional styles

attachBanner(document.body)
```

#### Using raw javascript

##### From a CDN

```html
<link rel="stylesheet" href="//unpkg.com/@beyonk/gdpr-cookie-consent-banner/dist/style.css">
<script src="//unpkg.com/@beyonk/gdpr-cookie-consent-banner/dist/browser/bundle.min.js"></script>
```

##### Storing a local copy

Download the contents of `dist/browser/bundle.js` and `dist/style.css` to your codebase, and include it in your html:

```html
<link rel="stylesheet" href="path/to/style.css">
<script src="path/to/bundle.js"></script>
<script>
  GdprConsent.attachBanner(document.body)
</script>
```

### Usage

Because this banner was designed to work across three different technology stacks, usage is a bit different to a regular es module.

I've documented our usage of it below:

#### Svelte v3

Just use it as a regular svelte component:

```svelte
<GdprBanner cookieName="foo" description="bar" on:analytics={initAnalytics} />

<script>
  import '@beyonk/gdpr-cookie-consent-banner/dist/style.css' // optional, you can also define your own styles
  import GdprBanner from '@beyonk/gdpr-cookie-consent-banner'

  function initAnalytics () {
    // do something with segment.io or google analytics etc
  }
</script>
```

#### SvelteKit

While this package should work with SvelteKit, the `cookie-universal` dependency is not yet ESM-compatible, so you'll need to add that package to the `vite/optimizeDeps/include` configuration in the Svelte config until it's migrated to ESM syntax. (See https://kit.svelte.dev/faq#packages.)

#### Svelte v2

See the v4.x.x tag of this repository.

#### Nuxt / Vue

You can use the banner in NuxtJS application as follows:

Create a component which uses the library, and mounts it during the render stage:
```js
<template>
  <div ref="gdprBanner"></div>
</template>

<script>
  export default {
    mounted () {
      const { attachBanner } = require('@beyonk/gdpr-cookie-consent-banner/dist/esm/bundle.js')
      attachBanner(this.$refs.gdprBanner, {
        heading: 'Cookie policy'
      })
    }
  }
</script>
```

Optionally, add this to your CSS array in your `nuxt.config.js` file:
```js
/**
 * Global CSS
 **/
css: ['your_other_css_file.css', '@beyonk/gdpr-cookie-consent-banner/dist/style.css'],
```

### Methods

You can re-call the cookie banner from an external link by binding the component instance and calling `show()` on it.

```svelte
<GdprBanner bind:this={gdprBanner} cookieName="foo" description="bar" on:analytics={initAnalytics} />

<script>
  import GdprBanner from '@beyonk/gdpr-cookie-consent-banner'

  let gdprBanner

  gdprBanner.show()
</script>
```

### Configuration

The defaults are shown below, simply put modified versions of as many of the below into an options object, and pass it to attachBanner.

It is not possible to opt-out of 'necessary' cookies.

```js
const options = {
  /**
   * You must set the cookie name.
   **/
  cookieName: 'beyonk_gdpr',

  /**
   * The cookie configuration, such as domain and path.
   **/
  cookieConfig: {
    domain: 'example.com',
    path: '/'
  },

  /**
   * These are the top two lines of text on the banner
   * The 'description' field can include html such as links
   **/
  heading: 'GDPR Notice',
  description: 'We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our <a href="/privacy-policy">privacy policy page</a>. By clicking accept, you consent to our privacy policy & use of cookies.',

  /**
   * All the button labels
   **/
  acceptLabel: 'Confirm all',
  settingsLabel: 'Preferences',
  closeLabel: 'Close window',

  /**
   * These are the default opt-ins and their descriptions.
   * When value is set to true, the option will automatically be checked on load.
   *
   * If you want to hide a category, simply set it to false, e.g. 'marketing: false'
   **/
  choices: {
      necessary: {
          label: "Necessary cookies",
          description: "Used for cookie control. Can't be turned off.",
          value: true
      },
      tracking: {
          label: "Tracking cookies",
          description: "Used for advertising purposes.",
          value: true
      },
      analytics: {
          label: "Analytics cookies",
          description: "Used to control Google Analytics, a 3rd party tool offered by Google to track user behavior.",
          value: true
      },
      marketing: {
          label: "Marketing cookies",
          description: "Used for marketing data.",
          value: true
      }
  },

  /**
   * Show an icon to edit cookies later, when banner is closed.
  **/
  showEditIcon: true,

  /**
   * These are the functions which are run if a user opts-in to that category.
   * You should drop your cookies here (or set a variable to control the later dropping of cookies.
   *
   * If you are using svelte, you can use events instead - see the Svelte section below.
   **/
  categories: {
    analytics: function() {
      console.log('No analytics cookies specified')
    },
    tracking: function() {
      console.log('No tracking cookies specified')
    },
    marketing: function() {
      console.log('No marketing cookies specified')
    },
    necessary: function() {
      console.log('No necessary cookies specified')
    }
  }
}
GdprConsent.attachBanner(document.body, options)
```
