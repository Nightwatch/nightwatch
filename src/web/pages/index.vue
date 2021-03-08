<template>
  <v-container fluid class="pa-0 home">
    <v-row align="center">
      <v-col cols="12" sm="12">
        <div class="text-center">
          <img class="" src="@/assets/nightwatch.png" alt="main logo" />
        </div>
      </v-col>
      <v-col cols="12" sm="12">
        <div class="text-center">
          <img class="" src="@/assets/slogan.png" alt="slogan" />
        </div>
      </v-col>
      <v-col cols="12" sm="12">
        <div class="text-center">
          <v-btn
            color="indigo"
            outlined
            target="_blank"
            href="https://discordapp.com/api/oauth2/authorize?client_id=465260354126086144&permissions=8&scope=bot"
            >Add to server</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
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

<style>
.home {
  margin-top: 220px;
}
</style>
