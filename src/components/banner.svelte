<script>
  import Cookie from 'cookie-universal'
  import { validate } from '../util'
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  const cookies = Cookie()
  export let cookieName = null

  let shown = false
  let settingsShown = false

  const showSettings = () => {
    settingsShown = !settingsShown
  }

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
    result[item.id] = item.value
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
      shown = true
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
    return validate(choices, cookie)
  }

  function execute(chosen) {
    const types = Object.keys(cookieChoices)

    types.forEach(t => {
      const agreed = chosen[t]
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

{#if shown}
  <div class="cookieConsentWrapper">
    <div class="cookieConsent">
      <div class="cookieConsent__Left">
        <div class="cookieConsent__Content">
          <h2 class="cookieConsent__Title">{heading}</h2>
          <p class="cookieConsent__Description">
            {@html description}
          </p>
        </div>
        <div class="cookieConsent__Operations" class:active={settingsShown}>
          <div class="cookieConsent__OperationsList">
            {#each choicesArr as choice}
              {#if choicesMerged.hasOwnProperty(choice.id) && choicesMerged[choice.id]}
                <div
                  class="cookieConsent__OperationsItem"
                  class:disabled={choice.id === 'necessary'}>
                  <input
                    type="checkbox"
                    id={`gdpr-check-${choice.id}`}
                    bind:checked={choicesMerged[choice.id].value}
                    disabled={choice.id === 'necessary'} />
                  <label for={`gdpr-check-${choice.id}`}>{choice.label}</label>
                  <span class="cookieConsent__OperationsItemLabel">
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
{/if}
