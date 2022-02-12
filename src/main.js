import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

import App from './App'
import router from './router'
import store from './store'

Vue.use(VueLazyload, {
  loading: require('./assets/loading.png')
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
