import Vue from "vue";
import App from "./App.vue";
import Pivot from "vue-flexmonster";
import "flexmonster/flexmonster.css";
Vue.use(Pivot);
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
