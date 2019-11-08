This is a fork of the original repo aimed at providing more flexibility and better visuals. It also fixes an error when loading the package from CDN directly. Please refrain from using the CDN link (if there's any).

### What's different?
- CSS has been detached from the main instance and separated into a file so it can be loaded conditionally (I usually don't prefer having CSS with my components and since Svelte doesn't have renderless components like Vue does I merely separated styles and markup and renamed all the classes)
- visuals have been vastly improved and CSS now uses BEM. I understand that the original uses scoped CSS from Svelte by default, but since I wanted to detach CSS completely I had to namespace my classes
- each cookie (necessary, analytics, etc.) now has a description value which is usually a requirement by the EU (e.g. Google analytics is a 3rd party service used to...)
- there's additional options for labels. Each cookie choice and every button can now be renamed (see fiddle for example

<p align="center">
  <img width="186" height="90" src="https://user-images.githubusercontent.com/218949/44782765-377e7c80-ab80-11e8-9dd8-fce0e37c235b.png" alt="Beyonk" />
</p>

## GDPR Cookie Consent banner

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

No CDN link as of now. Please see the methods above and below on how to either include the esm package or a local file.

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

#### Svelte v3

Just use it as a regular svelte component:

```html
<GdprBanner cookieName="foo" description="bar" on:analytics="this.someFunction()" />

<script>
  import GdprBanner from '@beyonk/gdpr-cookie-consent-banner'
</script>
```

#### Svelte v2

See the v4.x.x tag of this repository.

### Configuration

The defaults are shown below, simply put modified versions of as many of the below into an options object, and pass it to attachBanner.

It is not possible to opt-out of 'necessary' cookies.

```js
const options = {
  /**
   * You must set the cookie name.
   **/
  cookieName: 'gdpr_consent',

  /**
   * These are the top two lines of text on the banner
   * The 'description' field can include html such as links
   **/
  heading: 'GDPR Notice',
  description:
    'We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our <a href="/privacy-policy">privacy policy page</a>. By clicking accept, you consent to our privacy policy & use of cookies.',

  /**
   * All the button labels
   */
  acceptLabel: 'Confirm all',
  settingsLabel: 'Preferences',
  closeLabel: 'Close window',

  /**
   * Better cookie descriptions
   */
  choices: {
    necessary: {
      label: 'Required cookies',
      description:
        "These can't be turned off as they are used to control all the other cookies",
      value: true
    },
    analytics: false
  },

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
