<script>
  import '$lib/style.css'
  import Banner from '$lib/Banner.svelte'

  const categories = {
    analytics: function () {
      console.info('Dropped analytics cookies')
    },
    necessary: function () {
      console.info('Dropped necessary cookies')
    }
  }
  const choices = {
    analytics: function () {
      console.info('Dropped analytics cookies')
    },
    necessary: function () {
      console.info('Dropped necessary cookies')
    }
  }
</script>

<Banner cookieName="test_gdpr" {categories} {choices} />
