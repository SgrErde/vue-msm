import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import Login from '@/views/login'
import Layout from '@/components/Layout';
import Home from '@/views/home';
import Member from '@/views/member';
import Supplier from '@/views/supplier';
import Goods from '@/views/goods';
import Staff from '@/views/staff';


Vue.use(VueRouter);

export default new VueRouter({
  // mode: "history",
  //process.env.BASE_URL=='/'
  base: process.env.BASE_URL,
  routes: [{
    path: "/login",
    name: "login",
    component: Login
  }, {
    path: "/",
    name: "layout",
    component: Layout,
    redirect: '/home',
    children: [{
      path: '/home',
      component: Home,
      meta: {
        title: '首页'
      }
      // }, {不使用多个子路由的形式
      //   path: '/member',
      //   component: Member,
      //   meta: {
      //     title: '会员管理'
      //   }
    }]
  }, {
    path: "/member",
    component: Layout,
    children: [{
      path: '/',
      component: Member,
      meta: {
        title: '会员管理'
      }
    }]
  }, {
    path: "/supplier",
    component: Layout,
    children: [{
      path: '/',
      component: Supplier,
      meta: {
        title: '供应商管理'
      }
    }]
  }, {
    path: "/goods",
    component: Layout,
    children: [{
      path: '/',
      component: Goods,
      meta: {
        title: '商品管理'
      }
    }]
  }, {
    path: "/staff",
    component: Layout,
    children: [{
      path: '/',
      component: Staff,
      meta: {
        title: '员工管理'
      }
    }]
  }]
});