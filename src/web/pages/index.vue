<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="homepage-container">
        <div class="homepage-center-text">
          <!--<h1>NightWatch</h1>-->
          <img src="@/assets/logo2.png" alt="main logo" />
          <hr width="500px;" color="gray" />
          <!--<h3>The only Discord bot you'll ever need</h3>-->
          <img src="@/assets/slogan2.png" alt="slogan" />
        </div>
      </div>
    </v-flex>
  </v-layout>
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
