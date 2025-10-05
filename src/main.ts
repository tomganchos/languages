import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import './style.css'
import router from './router/index'
import App from './App.vue'

// import lesson1 from './data/en_supermarket.json'
// const lessons = [lesson1]
const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')

// PWA: Register service worker (works in dev + build with Vite base)
if ('serviceWorker' in navigator) {
  const swUrl = new URL('./sw.js', window.location.origin).toString();
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl).catch(console.error);
  });
}
