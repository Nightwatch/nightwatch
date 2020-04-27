<template>
  <v-app
    dark
    :style="{
      backgroundImage: 'url(' + require('@/assets/background6.jpg') + ')'
    }"
  >
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300&display=swap"
      rel="stylesheet"
    />
    <HeaderBar />
    <v-content app>
      <v-container>
        <nuxt app />
      </v-container>
    </v-content>

    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import HeaderBar from '@/components/core/Header'
import '@/css/base-style.css'

export default {
  components: {
    HeaderBar
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>

<style>
.content {
  border-radius: 25px;
  padding: 2em;
  margin: 1em auto;
  background-color: rgba(75, 0, 130, 0.2);
}
h1 {
  font-family: 'Montserrat', sans-serif;
}
</style>
