// 路由数量不多的情况下，可以直接将所有路由写入本文件
// 但如果路由数量很多，请分文件夹，然后 import 再解构

import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login_users'
    },
    {
      path: '/login_email',
      component: () => import('../views/LoginEmail.vue')
    },
    {
      path: '/home',
      redirect: '/home/calendar',
      component: () => import('../views/Home.vue'),
      children: [
        {
          path: '/home/classtable/timetable',
          component: () => import('../views/classtable/TimeTable.vue')
        },
        {
          path: '/home/finance/list',
          component: () => import('../views/finance/FinanceList.vue')
        },
        {
          path: '/home/finance/prop',
          component: () => import('../views/finance/FinanceProp.vue')
        },
        {
          path: '/home/finance/summary',
          component: () => import('../views/finance/FinanceSummary.vue')
        },
        {
          path: '/home/notebook/record',
          component: () => import('../views/notebook/Record.vue')
        },
        {
          path: '/home/notebook/summary',
          component: () => import('../views/notebook/Summary.vue')
        },
        {
          path: '/home/order',
          component: () => import('../views/Order.vue')
        },
        {
          path: '/home/calendar',
          component: () => import('../views/Calendar.vue')
        }
      ]
    },
    {
      path: '/login_users',
      component: () => import('../views/LoginUser.vue')
    },
    {
      path: '/forget',
      component: () => import('../views/Forget.vue')
    },
    {
      path: '/person',
      redirect: '/account',
      component: () => import('../views/Person.vue'),
      children: [
        {
          path: '/account',
          component: () => import('../views/person/Account.vue')
        },
        {
          path: '/personInformation',
          component: () => import('../views/person/PersonInformation.vue')
        },
        {
          path: '/message',
          component: () => import('../views/person/Message.vue')
        }
      ]
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login_users' || to.path == '/forget' || to.path == '/login_email') {
    localStorage.removeItem('token')
    next()
  } else {
    if (localStorage.getItem('token')) next()
    else {
      ElMessage.error('错误,请先登录！')
      next('/login_users')
    }
  }
})

export default router
