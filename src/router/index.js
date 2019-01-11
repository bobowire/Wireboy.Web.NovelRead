import Vue from 'vue'
import Router from 'vue-router'
import MyFirstPage from '@/components/MyFirstPage'
import NovelCategory from '@/components/NovelCategory'
import ReadNovel from '@/components/ReadNovel'

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  mode: 'history',
  routes: [
    {
      path: '',
      component: MyFirstPage
    },
    {
      path: '/novelcategory/:category/:guid',
      name: 'novelcategory',
      component: NovelCategory
    },
    {
      path: '/readnovel/:category/:guid/:page',
      name: 'readnovel',
      component: ReadNovel
    }
  ]
})
