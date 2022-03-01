import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

import App from './App'
import Loading from './components/Loading'
import router from './router'
import store from './store'
import Toast from '@/components/Toast'

Vue.use(VueLazyload, {
  loading: require('./assets/loading.png')
})

Vue.component(Loading.name, Loading)

Vue.prototype.$toast = Toast

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
