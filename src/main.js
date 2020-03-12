import Vue from "vue";
//注意在App.vue的上面引入
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";

Vue.use(ElementUI);

import '@/permission.js'
Vue.config.productionTip = process.env.NODE_ENV === 'production';

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");