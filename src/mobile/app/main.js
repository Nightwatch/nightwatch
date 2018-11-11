import Vue from 'nativescript-vue'
import App from './components/App'
import {
  RadSideDrawer
} from 'nativescript-ui-sidedrawer'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => RadSideDrawer)

new Vue({
  render: h => h('frame', [h(App)])
}).$start()
