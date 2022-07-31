<template>
  <div class="outer">
    <div class="container right-panel-active" ref="container" id="container">
      <!-- 用户名登录模块 -->
      <div class="container_form container--signup">
        <el-form :model="loginForm" class="form" id="form_lo" :rules="loginRules" ref="loginRef">
          <el-form-item><h2>登录</h2></el-form-item>
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" class="item" placeholder="邮箱">
              <template #prefix>
                <el-icon :size="22">
                  <message />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <div class="in">
            <el-form-item style="width: 100px; height: 27px" prop="code">
              <el-input v-model="loginForm.code" style="width: 100px; height: 27px" placeholder="输入验证码" />
            </el-form-item>
            <el-button style="height: 27px" @click="requestLoginCode">发送验证码</el-button>
          </div>
          <el-form-item id="link">
            <el-button type="text" @click="jump">账号密码登录</el-button>
          </el-form-item>
          <el-button type="primary" round class="btn1" @click="login">登录</el-button>
        </el-form>
      </div>
      <!-- 注册模块 -->
      <div class="container_form container--signin" ref="form_re">
        <el-form :model="registerForm" class="form" id="form_re" :rules="registerRules" ref="registerRef">
          <el-form-item><h2>注册</h2></el-form-item>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" class="item" placeholder="请输入用户名">
              <template #prefix>
                <el-icon :size="22"
                  ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                    <path
                      fill="currentColor"
                      d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0z"
                    ></path>
                  </svg>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="registerForm.email" class="item" placeholder="请输入邮箱">
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
          <el-form-item prop="passwd">
            <el-input v-model="registerForm.password" class="item" placeholder="请输入密码">
              <template #prefix>
                <el-icon :size="22"
                  ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
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
          <el-form-item prop="con_passwd">
            <el-input v-model="registerForm.con_passwd" class="item" placeholder="确认密码">
              <template #prefix>
                <el-icon :size="22"
                  ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
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
          <div class="in">
            <el-form-item style="width: 100px; height: 27px">
              <el-input v-model="registerForm.var_code" style="width: 100px; height: 27px" placeholder="输入验证码" />
            </el-form-item>
            <el-button style="height: 27px" @click="requestCode">发送验证码</el-button>
          </div>
          <el-button type="primary" round class="btn1" style="margin-top: 20px" @click="register">注册</el-button>
        </el-form>
      </div>
      <!-- 浮层-->
      <div class="container_overlay">
        <div class="overlay">
          <div class="overlay_panel overlay--left">
            <button class="btn" id="signIn" ref="signIn" @click="onSignIn">注册</button>
          </div>
          <div class="overlay_panel overlay--right">
            <button class="btn" id="signUp" ref="signUp" @click="onSignUp">登录</button>
          </div>
        </div>
      </div>
      <!-- 浮层结束 -->
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginEmail, registerUser, requestVarCode } from '../api/login'
export default {
  name: 'login',
  setup() {
    const signIn = ref(null)
    const signUp = ref(null)
    const form_re = ref(null)
    const form_lo = ref(null)
    const container = ref(null)
    const loginRef = ref('')
    const registerRef = ref('')

    function onSignIn() {
      console.log(container.value.classList)
      container.value.classList.remove('right-panel-active')
    }
    function onSignUp() {
      container.value.classList.add('right-panel-active')
    }
    // 登录数据
    const loginForm = reactive({
      email: '',
      code: ''
    })
    // 注册表单数据
    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      con_passwd: '',
      var_code: ''
    })
    // 两次密码判断
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 登录验证规则
    const loginRules = reactive({
      // 验证用户名是否合法
      email: [
        { required: true, message: '请填写邮箱', trigger: 'blur' },
        { type: 'string', message: '长度不能超过30位', trigger: 'blur', max: 30 }
      ],
      // 验证密码是否合法
      code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
    })
    // 注册校验规则
    const registerRules = reactive({
      username: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
        { pattern: /\s*\S+?/, message: '请输入非空字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请填写邮箱', trigger: 'blur' },
        { type: 'string', message: '长度不能超过30位', trigger: 'blur', max: 30 }
      ],
      passwd: [{ required: true, message: '密码不能为空', trigger: 'blur', max: 12 }],
      con_passwd: [{ required: true, validator: validatePass2, trigger: 'blur' }]
    })
    const router = useRouter()
    function jump() {
      router.push('/login_users')
    }
    // 登录功能
    function login() {
      loginRef.value.validate(async (valid) => {
        if (!valid) return
        loginEmail(loginForm).then((res) => {
          console.log(loginForm)
          // 判断是否登陆成功
          if (res.message != '成功') {
            alert('登陆失败')
          } else if (res.message == '成功') {
            // 后台打印返回值
            console.log(res)
            // 储存token到本地
            window.localStorage.setItem('token', res.result.token)
            router.push('/home')
          }
        })
      })
    }
    // 注册功能
    function register() {
      registerRef.value.validate(async (valid) => {
        if (!valid) return
        registerUser(registerForm).then((res) => {
          // 打印返回值
          console.log(res)
          // 判断是否注册成功
          if (res.succeed != true) {
            alert(res.message)
          } else if (res.succeed == true) {
            alert(res.message)
            router.push('/login_email')
          }
        })
      })
    }
    // 登录发送验证码
    function requestLoginCode() {
      console.log(loginForm.email)
      requestVarCode(loginForm.email).then((res) => {
        console.log(res)
        // 判断是否发送请求成功
        if (res.succeed != 'true') {
          alert(res.result)
        } else if (res.succeed == 'true') {
          alert(res.message)
        }
      })
    }
    // 发送验证码
    function requestCode() {
      console.log(registerForm.email)
      requestVarCode(registerForm.email).then((res) => {
        console.log(res)
        // 判断是否发送请求成功
        if (res.succeed != 'true') {
          alert(res.result)
        } else if (res.succeed == 'true') {
          alert(res.message)
        }
      })
    }
    return {
      loginForm,
      registerForm,
      loginRules,
      registerRules,
      loginRef,
      registerRef,
      requestLoginCode,
      validatePass2,
      jump,
      login,
      register,
      requestCode,
      signIn,
      signUp,
      form_re,
      form_lo,
      container,
      onSignIn,
      onSignUp
    }
  }
}
</script>
<style scoped>
@import url(../assets/css/login.css);
/* h2{
  font: size 30px;;
  margin-left: 12%;
} */
.btn1 {
  width: 100px;
  /* margin-left: 23%; */
}
#link {
  margin: 0;
}
</style>
