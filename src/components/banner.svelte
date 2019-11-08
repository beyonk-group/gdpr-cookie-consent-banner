<script>
  import Cookie from 'cookie-universal'
  import { validate } from '../util'
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  const cookies = Cookie()
  export let cookieName = null

  let settingsShown = false

  const showSettings = () => {
    settingsShown = !settingsShown
  }

  export let showOnInit = true
  let shown = showOnInit ? true : false

  export let heading = 'GDPR Notice'
  export let description =
    'We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.'

  export let categories = {
    analytics: function() {},
    tracking: function() {},
    marketing: function() {},
    necessary: function() {}
  }

  export let cookieConfig = {}

  /**
   * Sample messages
   */
  export let choices = {}
  const choicesDefaults = {
    necessary: {
      label: 'Necessary cookies',
      description: "Used for cookie control. Can't be turned off",
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
      description: 'Used for marketing data',
      value: true
    }
  }
  const choicesMerged = { ...choicesDefaults, ...choices }
  $: choicesArr = Object.values(choicesMerged).map((item, index) => {
    return {
      ...item,
      id: Object.keys(choicesMerged)[index]
    }
  })
  $: cookieChoices = choicesArr.reduce(function(result, item, index, array) {
    result[item.id] = item.value ? item.value : false
    return result
  }, {})

  export let acceptLabel = 'Accept cookies'
  export let settingsLabel = 'Cookie settings'
  export let closeLabel = 'Close settings'

  onMount(() => {
    if (!cookieName) {
      throw 'You must set gdpr cookie name'
    }

    const cookie = cookies.get(cookieName)
    if (cookie && chosenMatchesChoice(cookie)) {
      execute(cookie.choices)
    } else {
      removeCookie()
    }
  })

  function setCookie(choices) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 365)

    const options = Object.assign({}, cookieConfig, { expires })
    cookies.set(cookieName, { choices }, options)
  }

  function removeCookie() {
    const { path } = cookieConfig
    cookies.remove(cookieName, Object.assign({}, path ? { path } : {}))
  }

  function chosenMatchesChoice(cookie) {
    return validate(cookieChoices, cookie)
  }

  function execute(chosen) {
    const types = Object.keys(cookieChoices)

    types.forEach(t => {
      const agreed = chosen[t]
      choicesMerged[t] ? (choicesMerged[t].value = agreed) : false
      if (agreed) {
        categories[t]()
        dispatch(`${t}`)
      }
    })
    shown = false
  }

  function choose() {
    setCookie(cookieChoices)
    execute(cookieChoices)
  }
</script>

{#if showOnInit}
  <button
    class="cookieConsentToggle"
    on:click={() => (shown = true)}
    class:active={!shown}>
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

<div class="cookieConsentWrapper" class:active={shown}>
  <div class="cookieConsent">
    <div class="cookieConsent__Left">
      <div class="cookieConsent__Content">
        <h2 class="cookieConsent__Title">{heading}</h2>
        <p class="cookieConsent__Description">
          {@html description}
        </p>
      </div>
    </div>
    <div class="cookieConsent__Right">
      <button
        type="button"
        class="cookieConsent__Button"
        on:click={showSettings}>
        {settingsLabel}
      </button>
      <button type="submit" class="cookieConsent__Button" on:click={choose}>
        {acceptLabel}
      </button>
    </div>
  </div>
</div>

<div class="cookieConsentOperations" class:active={settingsShown}>
  <div class="cookieConsentOperations__List">
    {#each choicesArr as choice}
      {#if choicesMerged.hasOwnProperty(choice.id) && choicesMerged[choice.id]}
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
      on:click={showSettings}>
      {closeLabel}
    </button>
  </div>
</div>
