<template>
  <div class="reuseheader">
    <ol>
      <li><nuxt-link to="/">Home</nuxt-link></li>
      <li><nuxt-link to="/about">About</nuxt-link></li>
      <li><nuxt-link to="/features">Features</nuxt-link></li>
      <li>
        <a
          target="_blank"
          href="https://discordapp.com/api/oauth2/authorize?client_id=465260354126086144&permissions=8&scope=bot"
          >Add to Server</a
        >
      </li>
      <li><nuxt-link to="/contact">Contact</nuxt-link></li>
    </ol>
  </div>
</template>

<script>
import '@/css/header-style.css'

export default {
  name: 'Header'
}
</script>
