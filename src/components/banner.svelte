{#if shown}
<div class="wrapper">
  <div>
    <h1>{heading}</h1>
    <h2>{description}</h2>
  </div>
  <div class="operations">
    <ul>
      <li>
        <input type="checkbox" id="gdpr-check-necessary" bind:checked="choices.necessary" disabled>
        <label for="gdpr-check-necessary">Neccessary Cookies</label>
      </li>
      <li>
        <input type="checkbox" id="gdpr-check-tracking" bind:checked="choices.tracking">
        <label for="gdpr-check-tracking">Tracking Cookies</label>
      </li>
      <li>
        <input type="checkbox" id="gdpr-check-analytics" bind:checked="choices.analytics">
        <label for="gdpr-check-analytics">Analytics Cookies</label>
      </li>
      <li>
        <input type="checkbox" id="gdpr-check-marketing" bind:checked="choices.marketing">
        <label for="gdpr-check-marketing">Marketing Cookies</label>
      </li>
    </ul>
    <button type="button" on:click="choose()">Accept</button>
  </div>
</div>
{/if}

<style>
  h1 {
    font-size: 18px;
  }
  
  h2 {
    font-size: 14px;
  }

  .wrapper {
    padding: 2vh 2vw 0 2vw;
    font-family: sans-serif;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #07090F;
    color: #D6C3C9;
  }

  ul {
    display: inline-block;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  ul > li {
    display: inline-block;
    margin: 0 2vw;
  }

  .operations {
    text-align: center;
  }

  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"] + label {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 20px;
    font: 14px/20px 'Open Sans', Arial, sans-serif;
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
    padding: 1vh 1vw;
    color: white;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    background-color: #3A3C42;
    border: 0;
    border-bottom: 2px solid #EFF1C5;
    cursor: pointer;
    -webkit-box-shadow: inset 0 -2px #EFF1C5;
    box-shadow: inset 0 -2px #EFF1C5;

    transition: all 0.3s ease;
  }

  button:hover {
    background-color: #A0A2A8;
    color: #07090F;
    border-bottom: 2px solid #FFFFDF;
  }
</style>

<script>
  import Cookie from 'js-cookie'

  export default {
    data () {
      return {
        cookieName: 'beyonk_gdpr',
        shown: true,
        heading: 'GDPR Notice',
        description: "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.",
        groups: {
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
      const cookie = Cookie.get(cookieName)
      if (cookie) {
        this.set({ shown: false })
      }
    },

    methods: {
      choose () {
        const { groups, choices, cookieName } = this.get()
        Cookie.set(cookieName, { choices })
        const types = Object.keys(choices)
        types
          .filter(t => !!choices[t])
          .forEach(t => {
            groups[t]()
          })
        this.set({ shown: false })
      }
    }
  }
</script>