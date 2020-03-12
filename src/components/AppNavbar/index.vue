<template>
  <div class="navbar">
    <!-- default-active="/home" 与index="/home" 一样时，选中状态 -->
    <!-- active-text-color="#ffd04b" 选中时的颜色 -->
    <!-- :router='true' 值为true时开启路由模式，默认为false -->
    <!-- 报错详见 信息如下 原因  </el-menu> 写错位置#43，未将最后一个元素包含-->
    <!-- vue.runtime.esm.js?2b0e:619 [Vue warn]: Injection "rootMenu" not found -->
    <!-- found in -->
    <!--  <ElMenuItem> at packages/menu/src/menu-item.vue -->
    <!-- <AppNavbar> at src/components/AppNavbar/index.vue -->
    <!-- <Layout> at src/components/Layout.vue -->
    <!-- <App> at src/App.vue -->
    <!-- <Root> -->

    <el-menu
      :router="true"
      default-active="/home"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- 1、首页 -->
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!-- 2、会员管理 -->
      <el-menu-item index="/member/">
        <i class="el-icon-user-solid"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>
      <!-- 3、供应商管理 -->
      <el-menu-item index="/supplier/">
        <i class="el-icon-s-cooperation"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>
      <!-- 4、商品管理 -->
      <el-menu-item index="/goods/">
        <i class="el-icon-s-goods"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
      <!-- </el-menu> -->
      <!-- 5、员工管理 -->
      <el-menu-item index="/staff/">
        <i class="el-icon-user"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<style scoped>
.el-menu {
  border: none;
}
</style>