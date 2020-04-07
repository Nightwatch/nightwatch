<template>
  <v-app>
    <Header/>

    <router-view></router-view>
    <Footer />
  </v-app>
</template>

<script>
import Footer from '@/web/components/core/Footer'
import Header from '@/web/components/core/Header'

export default {
  name: 'App',
  components: {
    Footer,
    Header
  },
  data () {
    return {
      //
    }
  }
}
</script>
