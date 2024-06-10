import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewsInfoView from '@/views/NewsInfoView.vue'
import Mode1View from '@/views/Mode1View.vue'
import Mode2View from '@/views/Mode2View.vue'
import Mode3View from '@/views/Mode3View.vue'
import FriendlyView from '@/views/FriendlyView.vue'
import UserGuideView from '@/views/UserGuideView.vue'
import TechGuideView from '@/views/TechGuideView.vue'
import DevTeamView from '../views/DevTeamView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      alias: '/home',
      component: HomeView
    },
    {
      path: '/news-info',
      name: 'news',
      component: NewsInfoView
    },
    {
      path: '/mode1-options',
      name: 'mode1',
      component: Mode1View
    },
    {
      path: '/mode2-text',
      name: 'mode2',
      component: Mode2View
    },
    {
      path: '/mode3-options-text',
      name: 'mode3',
      component: Mode3View
    },
    {
      path: '/friendly-resources',
      name: 'friendly',
      component: FriendlyView
    },
    {
      path: '/user-guide',
      name: 'user-guide',
      component: UserGuideView
    },
    {
      path: '/technical-guide',
      name: 'tech-guide',
      component: TechGuideView
    },
    {
      path: '/dev-team',
      name: 'dev-team',
      component: DevTeamView
    },
    // old link redirect
    {
      path: '/contactUs',
      redirect: '/dev-team'
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/DevTeamView.vue')
    // }
  ]
})

export default router
