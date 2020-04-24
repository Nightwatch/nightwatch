<template>
  <v-app
    :style="{
      backgroundImage: 'url(' + require('@/assets/background6.jpg') + ')'
    }"
  >
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
