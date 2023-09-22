<script>
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

<cookie-consent-banner cookieName="test_gdpr" {categories} {choices} />
