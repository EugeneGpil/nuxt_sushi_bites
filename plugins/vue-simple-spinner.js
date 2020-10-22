import Vue from 'vue'
import VueSimpleSpinner from 'vue-simple-spinner'

if (process.browser) {
  Vue.use(VueSimpleSpinner)
}