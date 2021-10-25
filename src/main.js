import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// добавление своего стора
import Plugin from './core/Plugin'
import store from './store/store'
Vue.use(new Plugin('store', store))

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
