<template>
  <div class="container">
    <div class="container_form">
      <div class="form">
        <el-form :model="passwd" class="form" :rules="forgetFormRules">
          <el-form-item> <h1>-忘记密码-</h1></el-form-item>
          <el-form-item prop="email">
            <el-input v-model="passwd.email" placeholder="请输入邮箱">
              <template #prefix>
                <el-icon :size="22"
                  ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                    <path
                      fill="currentColor"
                      d="M128 224v512a64 64 0 0 0 64 64h640a64 64 0 0 0 64-64V224H128zm0-64h768a64 64 0 0 1 64 64v512a128 128 0 0 1-128 128H192A128 128 0 0 1 64 736V224a64 64 0 0 1 64-64z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M904 224 656.512 506.88a192 192 0 0 1-289.024 0L120 224h784zm-698.944 0 210.56 240.704a128 128 0 0 0 192.704 0L818.944 224H205.056z"
                    ></path>
                  </svg>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <div class="container_item">
            <el-form-item prop="var_code">
              <el-input v-model="passwd.var_code" style="width: 100px; height: 27px" placeholder="输入验证码" />
            </el-form-item>
            <el-button style="height: 27px" @click="requestCode">发送验证码</el-button>
          </div>
          <el-form-item prop="pwd">
            <el-input v-model="passwd.pwd" placeholder="输入密码">
              <template #prefix>
                <el-icon :size="22">
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                    <path
                      fill="currentColor"
                      d="M224 448a32 32 0 0 0-32 32v384a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32V480a32 32 0 0 0-32-32H224zm0-64h576a96 96 0 0 1 96 96v384a96 96 0 0 1-96 96H224a96 96 0 0 1-96-96V480a96 96 0 0 1 96-96z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M512 544a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V576a32 32 0 0 1 32-32zm178.304-295.296A192.064 192.064 0 0 0 320 320v64h352l96 38.4V448H256V320a256 256 0 0 1 493.76-95.104l-59.456 23.808z"
                    ></path>
                  </svg>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="re_pwd">
            <el-input v-model="passwd.re_pwd" placeholder="确认密码">
              <template #prefix>
                <el-icon :size="22">
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                    <path
                      fill="currentColor"
                      d="M224 448a32 32 0 0 0-32 32v384a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32V480a32 32 0 0 0-32-32H224zm0-64h576a96 96 0 0 1 96 96v384a96 96 0 0 1-96 96H224a96 96 0 0 1-96-96V480a96 96 0 0 1 96-96z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M512 544a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V576a32 32 0 0 1 32-32zm192-160v-64a192 192 0 1 0-384 0v64h384zM512 64a256 256 0 0 1 256 256v128H256V320A256 256 0 0 1 512 64z"
                    ></path>
                  </svg>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="onSubmit" style="width: 100px">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
import { forgetPasswd, requestVarCode } from '../api/login'
import { useRouter } from 'vue-router'
export default {
  name: 'forget',
  setup() {
    const passwd = reactive({
      email: '',
      var_code: '',
      pwd: '',
      re_pwd: ''
    })
    const router = useRouter()
    // 发送验证码
    function requestCode() {
      console.log(passwd.email)
      requestVarCode(passwd.email).then((res) => {
        // 打印返回值
        console.log(res)
        // 判断是否发送请求成功
        if (res.succeed != true) {
          alert(res.result)
        } else if (res.succeed == true) {
        }
      })
    }
    // 两次密码判断
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== passwd.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 忘记密码校验规则
    const forgetFormRules = reactive({
      email: [
        { required: true, message: '请填写邮箱', trigger: 'blur' },
        { type: 'string', message: '长度不能超过30位', trigger: 'blur', max: 30 }
      ],
      var_code: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      pwd: [{ required: true, message: '密码不能为空', trigger: 'blur', max: 12 }],
      re_pwd: [{ required: true, validator: validatePass2, trigger: 'blur' }]
    })
    // 提交信息
    const onSubmit = () => {
      console.log('submit!')
      forgetPasswd(passwd).then((res) => {
        console.log(res)
        // 判断请求是否成功
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          alert(res.message)
          router.push('/login_users')
        }
      })
    }
    return {
      passwd,
      forgetFormRules,
      onSubmit,
      requestCode
    }
  }
}
</script>
<style scoped>
@import url(../assets/css/forget.css);
</style>
