import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import MyPageView from '../views/MyPageView.vue'
import SignupView from '../views/SignupView.vue'
import ChatView from '../views/ChatView.vue'
import PlanView from '../views/PlanView.vue'
import HotelSearchView from '../views/HotelSearchView.vue'
import AllPlanView from '../views/AllPlanView.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: MyPageView
  },
  {
    path: '/chat',
    name: 'ChatView',
    component: ChatView
  },
  {
    path: '/plan',
    name: 'PlanView',
    component: PlanView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/hotel',
    name: 'hotel',
    component: HotelSearchView
  },
  {
    path: '/allplan',
    name: 'AllPlanView',
    component: AllPlanView
  },
  {
    path: '/plan/:planId',// URLにプランIDを含める
    name: 'planDetails',
    component: PlanView,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
