import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import { Dialog } from 'vant';

const app = createApp(App)

// 添加路由守卫
router.beforeEach((to,from)=>{
    if(to.path != '/login'){
        if(!localStorage.getItem('h5_token')){
            return '/login'
        }
    }
})

app.use(Dialog);
app.use(router)
app.mount('#app')
