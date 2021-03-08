<template>
  <v-footer absolute>
   <span>
     &copy;
     {{new Date().getFullYear()}}
     <a href="https://github.com/nightwatch" target="_blank">Nightwatch</a>
    </span>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
