import { createApp } from 'vue'
// import './style.css'
import router from './router/index'
import App from './App.vue'

// import lesson1 from './data/en_supermarket.json'
// const lessons = [lesson1]

createApp(App).use(router).mount('#app')
