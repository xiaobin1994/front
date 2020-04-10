import Vue from 'vue'
import Router from 'vue-router'

import Appointment from '../views/Appointment'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/pages/'
    },
    {
      path: '/pages',
      component: Appointment,
      children: [
        {
          path: '',
          redirect: '/pages/home'
        },
        {
          path: 'home',
          name: 'Appointment',
          component: Appointment
        },
      ]
    },
    {
      path: '*',
      redirect: '/pages/'
    }
  ]
})
