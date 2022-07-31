<template>
  <el-descriptions class="description" title="账号" :column="1" border>
    <template #extra>
      <el-button type="primary" @click="dialogFormVisible = true">修改信息</el-button>
    </template>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :size="20"
            ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
              <path
                fill="currentColor"
                d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0z"
              ></path>
            </svg>
          </el-icon>
          昵称
        </div>
      </template>
      {{ this.personForm.username }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :size="20"
            ><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
              <path
                fill="currentColor"
                d="M256 128a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h512a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H256zm0-64h512a128 128 0 0 1 128 128v640a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128V192A128 128 0 0 1 256 64zm128 128h256a32 32 0 1 1 0 64H384a32 32 0 0 1 0-64zm128 640a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"
              ></path>
            </svg>
          </el-icon>
          手机号
        </div>
      </template>
      {{ this.personForm.phone }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :size="20">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
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
          邮箱
        </div>
      </template>
      {{ this.personForm.email }}
    </el-descriptions-item>
  </el-descriptions>
  <!-- 密码管理模块 -->
  <el-row style="margin-left: 10%">
    <h3 style="margin-top: 10px">密码管理</h3>
    <el-button type="danger" plain style="margin-left: 12px; margin-top: 10px" @click="dialogFormVisible_re = true">重置密码</el-button>
    <el-button type="primary" plain style="margin-top: 10px" @click="dialogFormVisible_pa = true">修改密码</el-button>
  </el-row>
  <!-- 修改信息对话框 -->
  <el-dialog v-model="dialogFormVisible" title="账号">
    <el-form :model="personForm">
      <el-form-item label="姓名">
        <el-input v-model="personForm.username"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="personForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="personForm.email"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="changeAccount">修改</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 重置密码框 -->
  <el-dialog v-model="dialogFormVisible_re" title="重置密码" width="30%">
    <el-form :model="passwdForm" label-width="100px">
      <el-form-item label="邮箱">
        <el-input v-model="passwdForm.email" autocomplete="off" class="input_item" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="resetPassword">提交</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改密码框 -->
  <el-dialog v-model="dialogFormVisible_pa" title="修改密码" width="30%">
    <el-form :model="pasForm" label-width="100px" :rules="passwordRules" ref="passwordRef">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="pasForm.oldPassword" autocomplete="off" class="input_item" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="pasForm.password" autocomplete="off" class="input_item" />
      </el-form-item>
      <el-form-item label="确认密码" prop="repeatPassword">
        <el-input v-model="pasForm.repeatPassword" autocomplete="off" class="input_item" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="changPassword">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ref, reactive } from 'vue'
import { reset, change, getAccountInformation, account } from '../../api/person'
import { useRouter } from 'vue-router'
export default {
  setup() {
    // 建立方法
    const router = useRouter()
    // 账号数据
    const personForm = ref({
      username: '',
      phone: '',
      email: ''
    })
    const passwordRef = ref('')
    // 重置密码
    const passwdForm = reactive({
      email: ''
    })
    // 修改密码
    const pasForm = reactive({
      oldPassword: '',
      password: '',
      repeatPassword: ''
    })
    // 两次密码判断
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== pasForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 修改密码验证规则
    const passwordRules = reactive({
      oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      repeatPassword: [{ required: true, validator: validatePass2, trigger: 'blur', message: '两次密码不一致' }]
    })
    const dialogFormVisible = ref(false)
    const dialogFormVisible_re = ref(false)
    const dialogFormVisible_pa = ref(false)
    //获取账号信息
    function getAccount() {
      getAccountInformation().then((res) => {
        // 打印返回值
        console.log(res)
        // 判断是否获取成功
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          personForm.value = res.result
        }
      })
    }
    // 修改账号信息
    function changeAccount() {
      account(personForm.value).then((res) => {
        dialogFormVisible.value = false
        // 打印返回值
        console.log(res)
        // 判断是否请求成功
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          router.push('/account')
        }
      })
    }
    // 重置密码功能
    function resetPassword() {
      dialogFormVisible_re.value = false
      reset(passwdForm.value).then((res) => {
        // 打印返回值
        console.log(res)
        //判断请求是否成功
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          router.push('/login_users')
        }
      })
    }
    //修改密码
    function changPassword() {
      passwordRef.value.validate(async (valid) => {
        if (!valid) return
        change(pasForm).then((res) => {
          if (res.succeed != true) {
            alert(res.message)
          } else if (res.succeed == true) {
            dialogFormVisible_pa.value = false
            router.push('/login_users')
          }
        })
      })
    }
    return {
      dialogFormVisible,
      dialogFormVisible_re,
      dialogFormVisible_pa,
      passwdForm,
      personForm,
      pasForm,
      passwordRef,
      passwordRules,
      getAccount,
      changeAccount,
      resetPassword,
      changPassword,
      validatePass2
    }
  },
  mounted() {
    this.getAccount()
  }
}
</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.dialog {
  width: 300px;
}
.cell-item {
  width: 75px;
  display: flex;
  align-items: center;
}
.description {
  margin-top: 20px;
  margin-left: 10%;
  margin-right: 10%;
}
.item {
  width: 125px;
}
.input_item {
  width: 250px;
}
</style>
