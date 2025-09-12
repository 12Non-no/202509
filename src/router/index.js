import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import MyPageView from '../views/MyPageView.vue'
import SignupView from '../views/SignupView.vue'
import ChatView from '../views/SignupView.vue'
import BookView from '../views/SignupView.vue'

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
    path: '/book',
    name: 'BookView',
    component: BookView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
