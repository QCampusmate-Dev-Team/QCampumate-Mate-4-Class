import { createApp } from 'vue'
// import store from './store/index.js'
import ElementPlus from 'element-plus'

import "./styles/index.scss";
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
// .use(store)
.mount('#app')


