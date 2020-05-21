import Vue, { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import "./assets/styles/index.scss";

const app = createApp(App);
app.use(router);
app.mount("#app");
