// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible'

import Element from 'element-ui';
import { message } from './plugin/resetMessage';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Element)
Vue.prototype.$message = message;
Vue.config.productionTip = false

router.beforeEach((to, form, next) => {
  next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})

