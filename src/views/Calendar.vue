<template>
  <div class="header">{{ time }}好 , {{ username }}</div>
  <el-calendar v-model="value" />
</template>
<script>
import { getUsername } from '@/api/calendar.js'
import { onMounted, ref } from 'vue'
export default {
  name: 'calendar',
  setup() {
    const value = ref(new Date())
    const time = ref('')
    const username = ref('')
    // 判断当前时间
    let hours = new Date().getHours()
    if (hours >= 11 && hours <= 14) time.value = '中午'
    else if (hours > 14 && hours <= 19) time.value = '下午'
    else if (hours >= 5 && hours < 11) time.value = '早上'
    else time.value = '晚上'
    //获取用户账号
    onMounted(async () => {
      try {
        let res = await getUsername()
        username.value = res.result.username
      } catch (err) {
        console.error(err)
      }
    })
    return {
      value,
      time,
      username
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  height: 40px;
  font-size: 20px;
}
</style>
