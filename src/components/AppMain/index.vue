<template>
  <div class="main">
    <app-link v-show="$route.path!=='/home'"></app-link>
    <router-view></router-view>
  </div>
</template>
<script>
//引入vue 组件
import AppLink from "./Link.vue";
export default {
  components: {
    "app-link": AppLink
  }
};
</script>