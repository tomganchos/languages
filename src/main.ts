import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import './style.css'
import router from './router/index'
import App from './App.vue'

// import lesson1 from './data/en_supermarket.json'
// const lessons = [lesson1]
const pinia = createPinia()
// @ts-ignore
alert(!!window.Telegram?.WebApp)

createApp(App).use(router).use(pinia).mount('#app')
