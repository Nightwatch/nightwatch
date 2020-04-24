<template>
  <v-app-bar dense app>
    <v-toolbar-title>Nightwatch</v-toolbar-title>
    <v-spacer />
    <v-btn text color="indigo" to="/">Home</v-btn>
    <v-btn text color="indigo" to="/about">About</v-btn>
    <v-btn text color="indigo" to="/features">Features</v-btn>
    <v-btn text color="indigo" to="/contact">Contact</v-btn>

    <v-btn
      class="ma-2"
      color="indigo"
      outlined
      target="_blank"
      href="https://discordapp.com/api/oauth2/authorize?client_id=465260354126086144&permissions=8&scope=bot"
      >Add to Server</v-btn
    >
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style>
a.nuxt-link-exact-active {
  color: #0ec0ae;
}
</style>
