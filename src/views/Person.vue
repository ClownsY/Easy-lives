<template>
  <div class="common-layout">
    <el-container>
      <!-- 顶部 -->
      <el-header class="container_header"
        ><el-row><h1 @click="intoHome">易生活</h1> </el-row>
        <el-button class="bn" @click="backLogin" type="text">退出</el-button>
      </el-header>
      <!-- 页面主体部分 -->
      <el-container>
        <!-- 侧边栏菜单 -->
        <el-aside width="200px">
          <el-menu router default-active class="el-menu-vertical-demo" :collapse="isCollapse">
            <!-- 一级菜单 -->
            <el-menu-item index="account">
              <el-icon :size="22"
                ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                  <path
                    fill="currentColor"
                    d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0z"
                  ></path>
                </svg>
              </el-icon>
              <template #title>账号</template>
            </el-menu-item>
            <el-menu-item index="personInformation">
              <el-icon :size="22">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                  <path
                    fill="currentColor"
                    d="M192 128v768h640V128H192zm-32-64h704a32 32 0 0 1 32 32v832a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32zm160 448h384v64H320v-64zm0-192h192v64H320v-64zm0 384h384v64H320v-64z"
                  ></path>
                </svg>
              </el-icon>
              <template #title>个人信息</template>
            </el-menu-item>
            <el-menu-item index="message">
              <el-icon :size="22"
                ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                  <path fill="currentColor" d="M512 64a64 64 0 0 1 64 64v64H448v-64a64 64 0 0 1 64-64z"></path>
                  <path
                    fill="currentColor"
                    d="M256 768h512V448a256 256 0 1 0-512 0v320zm256-640a320 320 0 0 1 320 320v384H192V448a320 320 0 0 1 320-320z"
                  ></path>
                  <path fill="currentColor" d="M96 768h832q32 0 32 32t-32 32H96q-32 0-32-32t32-32zm352 128h128a64 64 0 0 1-128 0z"></path>
                </svg>
              </el-icon>
              <template #title>我的消息</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 右侧内容 -->
        <el-main>
          <router-view v-if="isRouterAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { ref, nextTick, provide } from 'vue'
import { useRouter } from 'vue-router'
import { exit } from '../api/login'

export default {
  setup() {
    let router = useRouter()
    const isCollapse = ref(false)
    function intoHome() {
      router.push('/home')
    }
    // 退出登录
    function backLogin() {
      exit().then((res) => {
        console.log(res)
        if (res.succeed != true) {
          alert(res.result)
        } else if (res.succeed == true) {
          window.localStorage.removeItem('token')
          console.log(window.localStorage.getItem('token'))
          router.push('/login_users')
        }
      })
    }
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
      isRouterAlive,
      isCollapse,
      intoHome,
      backLogin
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  margin-top: 10%;
  height: 590px;
  border-radius: 12px;
}
.el-main {
  width: 50vh;
  margin-top: 21px;
  border-radius: 12px;
  background-color: #ffffff;
}
.container_header {
  width: 100%;
  height: 75px;
  background-color: #1c80f2;
  background-image: url('../assets/image/header.png');
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 12px;
  border-radius: 5px;
}
.bn {
  width: 50px;
  height: 75px;
  position: absolute;
  left: 93%;
  top: 1%;
  border: none;
  background-color: transparent;
  color: #ffffff;
  font-size: 22px;
}
.link {
  margin-left: 5%;
  padding-top: 10px;
  font-size: 20px;
  color: #ffffff;
}
.icon_font {
  color: #ffffff;
  margin-right: 5px;
}
.image {
  margin-left: 60%;
}
.font {
  font-size: 16px;
  margin-left: 10px;
  margin-top: 13px;
  color: #ffffff;
}
h1 {
  width: 125px;
  height: 35px;
  color: #ffffff;
  font-size: 40px;
  margin-left: 2%;
}
</style>
