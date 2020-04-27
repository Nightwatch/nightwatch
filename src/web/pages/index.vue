<template>
  <div class="homepage-container">
    <div class="homepage-center-text">
      <!--<h1>Nightwatch</h1>-->
      <img src="@/assets/nightwatch.png" alt="main logo" />
      <hr width="500px;" color="gray" />
      <!--<h3>The only Discord bot you'll ever need</h3>-->
      <img src="@/assets/slogan.png" alt="slogan" />
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
