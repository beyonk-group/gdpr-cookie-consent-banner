<svelte:options customElement="cookie-consent-banner" />

<script>
  import Cookies from 'js-cookie'
  import { validate } from './util.js'
  import { fade } from 'svelte/transition'
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  /**
   * @type {string|undefined|null}
   */
  export let cookieName = null
  export let canRejectCookies = false
  export let showEditIcon = true

  /**
   * Whether to show the cookie banner if the user has not yet accepted or rejected your choices.
   *
   * @type {boolean|undefined|null}
   */
  export let visible = true

  let shown = false
  let settingsShown = false

  export let heading = 'GDPR Notice'
  export let description =
    'We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.'

  export let categories = {
    analytics: function () {},
    tracking: function () {},
    marketing: function () {},
    necessary: function () {}
  }

  export let cookieConfig = {}

  const defaults = {
    sameSite: 'strict'
  }

  export let choices = {}
  const choicesDefaults = {
    necessary: {
      label: 'Necessary cookies',
      description: "Used for cookie control. Can't be turned off.",
      value: true
    },
    tracking: {
      label: 'Tracking cookies',
      description: 'Used for advertising purposes.',
      value: true
    },
    analytics: {
      label: 'Analytics cookies',
      description:
        'Used to control Google Analytics, a 3rd party tool offered by Google to track user behavior.',
      value: true
    },
    marketing: {
      label: 'Marketing cookies',
      description: 'Used for marketing data.',
      value: true
    }
  }

  $: choicesMerged = Object.assign({}, choicesDefaults, choices)

  $: choicesArr = Object.values(choicesMerged).map((item, index) => {
    return Object.assign(
      {},
      item,
      { id: Object.keys(choicesMerged)[index] }
    )
  })

  $: cookieChoices = choicesArr.reduce((result, item) => {
    result[item.id] = item.value ? item.value : false
    return result
  }, {})

  $: necessaryCookieChoices = choicesArr.reduce((result, item) => {
    result[item.id] = item.id === 'necessary'
    return result
  }, {})

  export let acceptLabel = 'Accept cookies'
  export let rejectLabel = 'Reject cookies'
  export let settingsLabel = 'Cookie settings'
  export let closeLabel = 'Close settings'
  export let editLabel = 'Edit cookie settings'

  export function show () {
    shown = visible
  }

  onMount(() => {
    if (!cookieName) {
      throw new Error('You must set gdpr cookie name')
    }

    const cookie = Cookies.get(cookieName)
    if (!cookie) {
      show()
      return
    }

    try {
      const { choices } = JSON.parse(cookie)
      const valid = validate(cookieChoices, choices)

      if (!valid) {
        throw new Error('cookie consent has changed')
      }

      execute(choices)
    } catch (e) {
      removeCookie()
      show()
    }
  })

  function setCookie (choices) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 365)

    const options = Object.assign({}, defaults, cookieConfig, { expires })
    Cookies.set(cookieName, JSON.stringify({ choices }), options)
  }

  function removeCookie () {
    const { path } = cookieConfig
    Cookies.remove(cookieName, Object.assign({}, path ? { path } : {}))
  }

  function execute (chosen) {
    const types = Object.keys(cookieChoices)

    types.forEach(t => {
      const agreed = chosen[t]
      if (choicesMerged[t]) {
        choicesMerged[t].value = agreed
      }
      if (agreed) {
        categories[t] && categories[t]()
        dispatch(`${t}`)
      }
    })
    shown = false
  }

  function reject () {
    setCookie(necessaryCookieChoices)
    execute(necessaryCookieChoices)
  }

  function choose () {
    setCookie(cookieChoices)
    execute(cookieChoices)
  }
</script>

<style>
  .cookieConsentToggle {
    width: 40px;
    height: 40px;
    position: fixed;
    will-change: transform;
    padding: 9px;
    border: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    background: white;
    border-radius: 50%;
    bottom: 20px;
    right: 20px;
    transition: 200ms;
    opacity: 1;
    z-index: 99980;
  }

  .cookieConsentToggle:hover {
    color: white;
    background: black;
  }

  .cookieConsentToggle * {
    fill: currentColor;
  }

  .cookieConsentWrapper {
    z-index: 99990;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    color: white;
    padding: 20px;
    transition: 200ms;
  }

  .cookieConsent {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }

  .cookieConsent__Content {
    margin-right: 40px;
  }

  .cookieConsent__Title {
    margin: 0;
    font-weight: bold;
  }

  .cookieConsent__Description {
    margin: 10px 0 0;
  }

  .cookieConsent__Description a {
    color: white;
    text-decoration: underline;
  }

  .cookieConsent__Description a:hover {
    text-decoration: none;
  }

  .cookieConsent__Right {
    display: flex;
    align-items: flex-end;
  }

  .cookieConsentOperations {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    transition: 300ms;
    will-change: transform;
    z-index: 99999;
  }

  .cookieConsentOperations .cookieConsentOperations__List {
    transform: scale(1);
  }

  .cookieConsentOperations__List {
    background: white;
    color: black;
    max-width: 500px;
    padding: 40px;
    margin: auto;
    overflow-y: auto;
    box-sizing: border-box;
    max-height: 100vh;
    transition: 200ms transform;
    will-change: transform;
    transform: scale(0.95);
  }

  .cookieConsentOperations__Item {
    display: block;
    padding-left: 60px;
    margin-bottom: 20px;
  }

  .cookieConsentOperations__Item.disabled {
    color: #999;
  }

  .cookieConsentOperations__Item.disabled label::after {
    opacity: 0.3;
  }

  .cookieConsentOperations__Item input {
    display: none;
  }

  .cookieConsentOperations__Item label {
    align-items: center;
    font-size: 22px;
    font-weight: bold;
    display: block;
    position: relative;
  }

  .cookieConsentOperations__Item label::before {
    content: "";
    display: block;
    left: -60px;
    background: #DEDEDE;
    height: 20px;
    border-radius: 20px;
    width: 40px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .cookieConsentOperations__Item label::after {
    content: "";
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: black;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -58px;
    transition: 200ms;
  }

  .cookieConsentOperations__Item input:checked+label::after {
    transform: translate(20px, -50%);
  }

  .cookieConsent__Button {
    padding: 15px 40px;
    display: block;
    background: white;
    color: black;
    white-space: nowrap;
    border: 0;
    font-size: 16px;
    margin-left: 10px;
    cursor: pointer;
    transition: 200ms;
  }

  .cookieConsent__Button--Close {
    background: black;
    color: white;
    margin: 40px 0 0 60px;
    padding: 15px 60px;
  }

  .cookieConsent__Button:hover {
    opacity: 0.6;
  }

  @media only screen and (max-width: 900px) {
    .cookieConsent {
      display: block;
    }

    .cookieConsent__Right {
      margin-top: 20px;
    }

    .cookieConsent__Button {
      margin: 0 10px 10px 0;
    }

    .cookieConsent__Button--Close {
      margin: 40px 0 0;
    }
  }
</style>

{#if showEditIcon}
  <button
    class="cookieConsentToggle"
    aria-label={editLabel}
    on:click={show}
    transition:fade>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17
        0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13
        35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0
        0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77
        54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11
        80.53-12.76l69.13-35.21a132.273 132.273 0 0 0
        57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176
        368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32
        32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33
        32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32
        32-14.33 32-32 32z" />
    </svg>
  </button>
{/if}

{#if shown}
<div class="cookieConsentWrapper" transition:fade>
  <div class="cookieConsent">
    <div class="cookieConsent__Left">
      <div class="cookieConsent__Content">
        <p class="cookieConsent__Title">{heading}</p>
        <p class="cookieConsent__Description">
          {@html description}
        </p>
      </div>
    </div>
    <div class="cookieConsent__Right">
      <button
        type="button"
        class="cookieConsent__Button"
        aria-label={settingsLabel}
        on:click={() => { settingsShown = true } }>
        {settingsLabel}
      </button>
      {#if canRejectCookies}
      <button type="submit" class="cookieConsent__Button" on:click={reject} aria-label={rejectLabel}>
        {rejectLabel}
      </button>
      {/if}
      <button type="submit" class="cookieConsent__Button" on:click={choose} aria-label={acceptLabel}>
        {acceptLabel}
      </button>
    </div>
  </div>
</div>
{/if}

{#if settingsShown}
<div class="cookieConsentOperations" transition:fade>
  <div class="cookieConsentOperations__List">
    {#each choicesArr as choice}
      {#if Object.hasOwnProperty.call(choicesMerged, choice.id) && choicesMerged[choice.id]}
        <div
          class="cookieConsentOperations__Item"
          class:disabled={choice.id === 'necessary'}>
          <input
            type="checkbox"
            id={`gdpr-check-${choice.id}`}
            bind:checked={choicesMerged[choice.id].value}
            disabled={choice.id === 'necessary'} />
          <label for={`gdpr-check-${choice.id}`}>{choice.label}</label>
          <span class="cookieConsentOperations__ItemLabel">
            {choice.description}
          </span>
        </div>
      {/if}
    {/each}
    <button
      type="submit"
      class="cookieConsent__Button cookieConsent__Button--Close"
      aria-label={closeLabel}
      on:click={() => { settingsShown = false } }>
      {closeLabel}
    </button>
  </div>
</div>
{/if}
