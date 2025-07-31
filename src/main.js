import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import { Dialog } from 'vant';

const app = createApp(App)

app.use(Dialog);
app.use(router)
app.mount('#app')
