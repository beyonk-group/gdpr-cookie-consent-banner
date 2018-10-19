<p align="center">
  <img width="186" height="90" src="https://user-images.githubusercontent.com/218949/44782765-377e7c80-ab80-11e8-9dd8-fce0e37c235b.png" alt="Beyonk" />
</p>

## GDPR Cookie Consent banner

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![CircleCI](https://circleci.com/gh/beyonk-adventures/gdpr-cookie-consent-banner.svg?style=shield)](https://circleci.com/gh/beyonk-adventures/gdpr-cookie-consent-banner)

### What is it?

This is a vanilla JS implementation (thanks to [Svelte](http://svelte.technology)) of a compliant GDPR banner. It allows the user granular opt-in and out of four different cookie categories.

### How do I install it?

#### Via NPM

Simply install the node module into your codebase.

```bash
npm install --save-dev @beyonk/gdpr-cookie-consent-banner
```

then import the banner into your code:

```js
  import attachBanner from '@beyonk/gdpr-cookie-consent-banner'
  attachBanner(document.body)
```

#### Using raw javascript

##### From a CDN

You can include the minified script directly from unpkg cdn:

```html
<script src="//unpkg.com/@beyonk/gdpr-cookie-consent-banner@3.1.0/dist/browser/bundle.min.js"></script>
```

##### Storing a local copy

Download the contents of `dist/bundle.js` to your codebase, and include it in your html:

```html
  <script src="path/to/bundle.js"></script>
  <script>
    GdprConsent.attachBanner(document.body)
  </script>
```

### Usage

Because this banner was designed to work across three different technology stacks, usage is a bit different to a regular es module.

I've documented our usage of it below:

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

#### Svelte

Just use it as a regular svelte component:

```html
<GdprBanner />

<script>
  import GdprBanner from '@beyonk/gdpr-cookie-consent-banner'

  export default {
    components: {
      GdprBanner
    }
  }
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
  description: "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our <a href=\"/privacy-policy\">privacy policy page</a>. By clicking accept, you consent to our privacy policy & use of cookies.",
  
  /**
   * These are the functions which are run if a user opts-in to that category.
   * You should drop your cookies here (or set a variable to control the later dropping of cookies.
   * 
   * If you don't want to show a category, simply remove the specified function (and key) from this object.
   **/
  categories: {
    analytics: function () {
      console.log('No analytics cookies specified')
    },
    tracking: function () {
      console.log('No tracking cookies specified')
    },
    marketing: function () {
      console.log('No marketing cookies specified')
    },
    necessary: function () {
      console.log('No necessary cookies specified')
    },
  },

  /**
   * These are the default opt-ins.
   * When set to true, the option will automatically be checked on load.
   **/
  choices: {
    necessary: true,
    marketing: true,
    analytics: true,
    tracking: true
  }
}

GdprConsent.attachBanner(document.body, options)
```
