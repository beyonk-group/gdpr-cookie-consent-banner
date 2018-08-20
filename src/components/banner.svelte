{#if shown}
<div class="wrapper">
  <div class="left">
    <div class="text">
      <h1>{heading}</h1>
      <h2>{@html description}</h2>
    </div>
    <div class="operations">
      <ul>
        {#if categories.necessary}
          <li>
            <input type="checkbox" id="gdpr-check-necessary" bind:checked="choices.necessary" disabled>
            <label for="gdpr-check-necessary">Neccessary Cookies</label>
          </li>
        {/if}
        {#if categories.tracking}
          <li>
            <input type="checkbox" id="gdpr-check-tracking" bind:checked="choices.tracking">
            <label for="gdpr-check-tracking">Tracking Cookies</label>
          </li>
        {/if}
        {#if categories.analytics}
          <li>
            <input type="checkbox" id="gdpr-check-analytics" bind:checked="choices.analytics">
            <label for="gdpr-check-analytics">Analytics Cookies</label>
          </li>
        {/if}
        {#if categories.marketing}
          <li>
            <input type="checkbox" id="gdpr-check-marketing" bind:checked="choices.marketing">
            <label for="gdpr-check-marketing">Marketing Cookies</label>
          </li>
        {/if}
      </ul>
    </div>
  </div>
  <div class="right">
    <button type="button" on:click="choose()">Accept</button>
  </div>
</div>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:600');

  h1 {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }
  
  h2 {
    font-size: 14px;
    line-height: 16px;
  }

  h1, h2, label, button {
    color: #fff;
    font-family: 'Montserrat', sans-serif;
  }

  .wrapper {
    z-index: 99999;
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    width: 100vw;
    background-color: rgba(7, 9, 15, 0.75);
    color: #fff;
    padding: 20px;
  }

  .text {
    margin-right: 20px;
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 200px;
    text-align: center;
    flex-grow: 1;
  }

  ul {
    display: inline-block;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  ul > li {
    display: inline-block;
  }

  .operations {
    text-align: left;
  }

  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"] + label {
    display: block;
    position: relative;
    padding-left: 35px;
    padding-right: 15px;
    margin-bottom: 10px;
    font-size: 14px/20px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  input[type="checkbox"] + label:before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border: 1px solid #D6C3C9;
    position: absolute;
    left: 0;
    top: 0;
    opacity: .6;
    -webkit-transition: all .12s, border-color .08s;
    transition: all .12s, border-color .08s;
  }

  input[type="checkbox"]:checked + label:before {
    width: 10px;
    top: -5px;
    left: 5px;
    border-radius: 0;
    opacity: 1;
    border-top-color: transparent;
    border-left-color: transparent;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  button {
    font-size: 14px;
    max-width: 200px;
    text-transform: uppercase;
    font-weight: bold;
    padding: 1vh 1vw;
    color: #fff;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    background-color: #ff9273;
    border: 0;
    border: 4px solid #ff9273;;
    cursor: pointer;

    transition: all 0.3s ease;
  }

  button:hover {
    background-color: #fff;
    color: #ff9273;
  }


  @media only screen and (max-width: 600px) {
    .wrapper {
      flex-direction: column;
    }

    .operations {
      margin-bottom: 35px;
    }

    button {
      max-width: 100vw;
      margin-bottom: 2vh;
    }
  }

</style>

<script>
  import Cookie from 'cookie-universal'

  const cookies = Cookie()

  export default {
    data () {
      return {
        cookieName: null,
        shown: true,
        heading: 'GDPR Notice',
        description: "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.",
        categories: {
          analytics: function () {
            console.info('No analytics cookies specified')
          },
          tracking: function () {
            console.info('No tracking cookies specified')
          },
          marketing: function () {
            console.info('No marketing cookies specified')
          },
          necessary: function () {
            console.info('No necessary cookies specified')
          }
        },
        choices: {
          necessary: true,
          marketing: true,
          analytics: true,
          tracking: true
        }
      }
    },

    oncreate () {
      const { cookieName } = this.get()
      if (!cookieName) {
        throw('You must set gdpr cookie name')
      }

      const cookie = cookies.get(cookieName)
      if (cookie) {
        console.log('cookie, exists')
        this.execute(cookie.choices)
      }
    },

    methods: {
      setCookie (choices) {
        const { cookieName, cookieConfig } = this.get()
        const expires = new Date()
        expires.setDate(expires.getDate() + 365)

        const options = Object.assign({}, cookieConfig ? cookieConfig : {}, { expires })
        cookies.set(cookieName, { choices }, options)
      },

      execute (choices) {
        const { categories } = this.get()
        const types = Object.keys(categories)

        types
        .forEach(t => {
          const agreed = choices[t]
          if (agreed) {
            categories[t]()
          }
        })
        this.set({ shown: false })
      },

      choose () {
        const { categories, choices } = this.get()
        this.setCookie(choices)
        this.execute(choices)
      }
    }
  }
</script>