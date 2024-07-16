<cookie-consent-banner bind:this={cc} cookie-name="test_gdpr" heading="Noice nay" cookie-config={cookieConfig} />

<script>
  import { onMount } from 'svelte'
  import '$lib/Banner.svelte'

  const cookieConfig = JSON.stringify({ foo: 'bar ' })

  let cc

  const types = [ 'analytics', 'marketing', 'tracking', 'necessary' ]

  onMount(() => {
    for (const type of types) {
      cc.addEventListener(type, (e) => {
        if (e.detail.agreed) {
          console.log(`${type} consent given`)
        } else {
          console.log(`${type} consent rejected`)
        }
      })
    }
  })
</script>

<a href="/">Back</a>
