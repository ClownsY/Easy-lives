<script>
import { onMounted, ref, watch, nextTick, provide } from 'vue' //要引入方法
export default {
  name: 'app',
  created() {
    console.log('123', this.$route.path)
  },
  setup() {
    // 局部组件刷新
    const isRouterAlive = ref(true)
    const reload = () => {
      isRouterAlive.value = false
      nextTick(() => {
        isRouterAlive.value = true
      })
    }
    provide('reload', reload)
    return {
      isRouterAlive
    }
  },
  watch: {}
}
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
body {
  background-image: url(@/assets/image/bigest.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
