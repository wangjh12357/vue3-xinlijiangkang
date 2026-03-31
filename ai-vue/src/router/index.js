import { createRouter, createWebHistory } from 'vue-router'
import FrontendLayout from '@/components/FrontendLayout.vue'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'



//后台路由
const backendRouters = [
  {
    path: '/back',
    component: () => import('@/components/BackendLayout.vue'),
    redirect: '/back/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        },
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare',
        },
      },
      {
        path: 'consultations',
        component: () => import('@/views/consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message',
        },
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User',
        },
      },
    ],
  },
  {
    path:'/auth',
    component: () => import('@/components/AuthLayout.vue'),
    redirect:'/auth/login',
    children:[
      {
        path:'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
        },
        
      },
      {
        path:'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册',
        },
      }
    ]
  }
]


//用户路由
const frontendRouters = [
  {
    path:'/',
    component: FrontendLayout,
    // redirect:'/',
    children:[
      {
        path:'',
        component: () => import('@/views/home.vue'),
      },
      {
        path:'consultation',
        component: () => import('@/views/consultation.vue'),
      },
      {
        path:'emotion-diary',
        component: () => import('@/views/emotionDiary.vue'),
      },
      {
        path:'knowledge',
        component: () => import('@/views/frontendKnowledge.vue'),
      },
      {
        path:'knowledge/article/:id',
        component: () => import('@/views/articleDetail.vue'),
        props: true,
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes:[...backendRouters,...frontendRouters]
})
//路由的前置守卫
router.beforeEach((to,from,next) => {
  //判断是否登录
  const token = localStorage.getItem('token')
  if(token){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    //如果是后台用户
    if(userInfo.userType === 2){
      if(to.path.startsWith('/back')){
        next()
      }else{
        next('/back/dashboard')
      }
    }else if(userInfo.userType == 1){
      //用户端的账号只能访问前台路由
      if(to.path.startsWith('/back') || to.path.startsWith('/auth')){
        next('/')
      }else{
        next()
      }
    }
    
  }else{
    //未登录，判断是否是登录页
    if(to.path.startsWith('/back')){
      next('/auth/login')
    }else{
      
      next()
    }
  }
})
export default router
