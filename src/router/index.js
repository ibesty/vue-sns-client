import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Timeline from '@/components/Timeline'
import Personal from '@/components/Personal'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Timeline',
      component: Timeline
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/i/:username',
      name: 'Personal',
      component: Personal
    }
  ]
})
