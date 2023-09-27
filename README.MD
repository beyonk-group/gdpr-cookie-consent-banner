<a href="https://beyonk.com">
  <br />
  <br />
  <img src="https://user-images.githubusercontent.com/218949/144224348-1b3a20d5-d68e-4a7a-b6ac-6946f19f4a86.png" width="198" />
  <br />
  <br />
</a>

## GDPR Cookie Consent banner

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![actions](https://github.com/beyonk-adventures/gdpr-cookie-consent-banner/actions/workflows/publish.yml/badge.svg)](https://github.com/beyonk-adventures/gdpr-cookie-consent-banner/actions/workflows/publish.yml) [![SvelteKit](https://img.shields.io/badge/svelte-kit-orange.svg)](https://kit.svelte.dev) [![Svelte v3](https://img.shields.io/badge/svelte-v3-blueviolet.svg)](https://svelte.dev)

### What is it?

Svelte implementation of a compliant GDPR banner. It allows the user granular opt-in and out of four different cookie categories.

It now works with SvelteKit without any workarounds!

### What are its features?

* Small, discrete, and non-intrusive
* GDPR Compliant
* Responsive
* Offers four categories
* Runs any function on opting-in
* Runs opted-in functions on each visit
* Changing the choices requires the user to opt-in again.
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

#### Via CDN
```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@beyonk/gdpr-cookie-consent-banner/dist/index.js"
></script>
```

### Usage

#### Svelte

Just use it as a regular svelte component:

```svelte
<GdprBanner cookieName="foo" description="bar" on:analytics={initAnalytics} />

<script>
  import '@beyonk/gdpr-cookie-consent-banner/banner.css' // optional, you can also define your own styles
  import GdprBanner from '@beyonk/gdpr-cookie-consent-banner'

  function initAnalytics () {
    // do something with segment.io or google analytics etc
  }
</script>
```

#### HTML

Tap into either [unpkg](https://unpkg.com) or [jsdelivr](https://jsdelivr.net):

```html
<!-- optional, you can also define your own styles -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@beyonk/gdpr-cookie-consent-banner/src/banner.css"
></script>

<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@beyonk/gdpr-cookie-consent-banner/dist/index.js"
></script>

<cookie-consent-banner cookieName="foo" description="bar" />
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

### Props

The defaults are shown below.

It is not possible to opt-out of 'necessary' cookies.

```js
const props = {
  /**
   * You must set the cookie name.
   **/
  cookieName: 'beyonk_gdpr',

  /**
   * Whether to display the banner to the user or not. This can be because you're in an iframe
   * and there is no room to show it if they haven't already consented, but, if they have already
   * consented, you want to action the "enableAnalytics" and similar handlers if they *have*.
   *
   * Default is true
   **/
  visible: true,

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
   * All the button labels and aria-label content.
   **/
  acceptLabel: 'Confirm all',
  rejectLabel: 'Reject all',
  settingsLabel: 'Preferences',
  closeLabel: 'Close window',
  editLabel: 'Edit settings',

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
```
