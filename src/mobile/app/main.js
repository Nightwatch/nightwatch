import Vue from 'nativescript-vue'
import App from './components/App'
import devTools from '@vue/devtools'
import {
  RadSideDrawer
} from 'nativescript-ui-sidedrawer'

const isProduction = TNS_ENV === 'production' // eslint-disable-line

Vue.registerElement('RadSideDrawer', () => RadSideDrawer)

new Vue({
  render: h => h('frame', [h(App)])
}).$start()

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = isProduction

if (!isProduction) {
  devTools.init(Vue)
}
