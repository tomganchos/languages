import { createRouter, createWebHistory } from 'vue-router'
import Cards from '../views/Cards.vue'
import Grammar from '../views/Grammar.vue'
import Search from '../views/Search.vue'

const isProduction = process.env.NODE_ENV === 'production'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: isProduction ? '/languages/' : '/',
      name: 'Cards',
      component: Cards
    },
    // {
    //   path: '/languages/',
    //   // redirect: '/dashboard',
    //   name: 'WordsPage',
    //   component: WordsPage
    // },
    {
      path: isProduction ? '/languages/grammar' : '/grammar',
      name: 'Grammar',
      component: Grammar
    },
    {
      path: isProduction ? '/languages/search' : '/search',
      name: 'Search',
      component: Search
    },
    // {
    //   path: '/languages/full',
    //   name: 'FullList',
    //   component: FullList
    // }
    {
      path: isProduction ? '/languages/*' : '/*',
      redirect: isProduction ? '/languages/' : '/'
    },
  ]
})

export default router
