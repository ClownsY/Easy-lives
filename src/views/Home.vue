<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="words">{{ words }}</div>
        <div class="headPic" @click="showClick" :style="{ backgroundImage: 'url(' + bacUrl + ')' }">
          <div class="redPoint" v-if="showPoint"></div>
          <el-dropdown ref="dropdown1" trigger="contextmenu" style="margin: 90px 48px" size="large">
            <span class="el-dropdown-link"> Dropdown List1 </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="intoPersonal">个人中心</el-dropdown-item>
                <el-dropdown-item @click="backLogin">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router default-active>
            <el-sub-menu index="1">
              <template #title>
                <el-icon><tools /></el-icon>
                <span>财务管理</span>
              </template>
              <el-menu-item-group #title>
                <el-menu-item index="/home/finance/list">财务列表</el-menu-item>
                <el-menu-item index="/home/finance/prop">财务总汇</el-menu-item>
                <el-menu-item index="/home/finance/summary">财务统计</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><tickets /></el-icon>
                <span>记事本</span>
              </template>
              <el-menu-item-group #title>
                <el-menu-item index="/home/notebook/record">记事</el-menu-item>
                <el-menu-item index="/home/notebook/summary">统计</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><setting /></el-icon>
                <span>点餐推荐</span>
              </template>
              <el-menu-item-group #title>
                <el-menu-item index="/home/order">点餐</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon><calendar /></el-icon>
                <span>课程表</span>
              </template>
              <el-menu-item-group #title>
                <el-menu-item index="/home/classtable/TimeTable">课程表</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import home from '@/api/home.js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'Home',
  setup() {
    onMounted(() => {
      showWords()
      getPic()
      showRed()
      sendNotice()
    })
    let router = useRouter()
    let showPoint = ref(false)
    let words = ref('')
    const dropdown1 = ref()
    const bacUrl = ref('')
    async function sendNotice() {
      try {
        await home.sendNotice()
      } catch (err) {
        console.error(err)
      }
    }
    async function getPic() {
      try {
        let res = await home.getUrl()
        bacUrl.value = res.result
      } catch (err) {
        console.error(err)
      }
    }
    async function showRed() {
      try {
        let res = await home.getLength()
        console.log(res)
        if (res.result.length != 0) showPoint.value = true
        else showPoint.value = false
      } catch (err) {
        console.error(err)
      }
    }
    function handleVisible2(visible) {
      if (visible) {
        dropdown1.value.handleClose()
      } else {
        dropdown1.value.handleOpen()
      }
    }
    function showClick() {
      dropdown1.value.handleOpen()
    }
    function showWords() {
      fetch('https://v1.hitokoto.cn')
        .then(function (res) {
          return res.json()
        })
        .then(function (data) {
          console.log(data)
          words.value = data.hitokoto
        })
        .catch(function (err) {
          console.error(err)
        })
    }
    function intoPersonal() {
      router.push('/person')
    }
    function backLogin() {
      router.push('/login_users')
      localStorage.removeItem('token')
    }
    return {
      words,
      showClick,
      handleVisible2,
      dropdown1,
      intoPersonal,
      backLogin,
      bacUrl,
      showPoint
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  position: relative;
  --el-header-height: 130px;
  background: url(../assets/image/header.png);
  background-repeat: no-repeat;
  background-size: cover;
}
.el-aside {
  height: 900px;
  overflow: hidden;
  margin-right: 10px;
  margin-top: 10px;
}
.el-aside:hover,
.el-main:hover {
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.18);
}
.el-menu {
  --el-menu-border-color: white;
  --el-menu-item-height: 75px;
}
.common-layout {
  width: 1550px;
  margin: 0 auto;
}
.el-main {
  position: relative;
  height: 900px;
  width: 1400px;
  background-color: #fff;
  margin-top: 10px;
}
.el-menu {
  height: 100%;
}
.el-sub-menu,
.el-menu-item,
.el-sub-menu__title > span {
  font-size: 20px;
  font-family: '楷体';
}
.words {
  position: absolute;
  left: 20px;
  top: 20px;
  font-size: 40px;
  font-family: '楷体';
  color: #d1dbe5;
}
.headPic {
  position: absolute;
  right: 30px;
  top: 10px;
  width: 100px;
  height: 100px;
  font-size: 0;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.redPoint {
  position: absolute;
  right: 0;
  top: 10;
  height: 25px;
  width: 25px;
  background-color: red;
  border-radius: 50%;
}
</style>
