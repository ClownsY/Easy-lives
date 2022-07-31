import { createApp } from 'vue'
import App from './App.vue'

//引入路由
import VueRouter from './router/index'

// 引入全局css
import './style/global.css'

//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'

//引入animate.css
import animated from 'animate.css'

const app = createApp(App)
Object.keys(ElIconModules).forEach(function (key) {
  app.component(ElIconModules[key].name, ElIconModules[key])
})

app.use(ElementPlus).use(VueRouter).use(animated).mount('#app')
