<template>
  <!-- 个人信息 -->
  <div class="description">
    <el-descriptions class="margin-top" title="个人信息" :column="1" border>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon><Picture /></el-icon>
            头像
          </div>
        </template>
        <img :src="BacSrc" />
        <el-button class="portrait" type="primary" @click="dialogPortrait = true">上传头像</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            姓名
          </div>
        </template>
        {{ personForm.username }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <iphone />
            </el-icon>
            手机号
          </div>
        </template>
        {{ personForm.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <location />
            </el-icon>
            邮箱
          </div>
        </template>
        {{ personForm.email }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <office-building />
            </el-icon>
            地址
          </div>
        </template>
        {{ personForm.school }}
      </el-descriptions-item>
    </el-descriptions>
    <el-button type="primary" @click="dialogFormVisible = true" class="infor">修改信息</el-button>
  </div>
  <!-- 个人信息修改框 -->
  <el-dialog v-model="dialogFormVisible" title="个人信息" width="32%">
    <el-form :model="personForm" label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="personForm.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="personForm.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="personForm.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="personForm.school" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 上传头像 -->

  <el-dialog v-model="dialogPortrait" title="上传头像" width="40%" center="true">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :headers="header"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :auto-upload="true"
      :limit="1"
    >
      <img v-if="showMsg" :src="imgUrl" class="avatar" />

      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogPortrait = false">完成</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import home from '@/api/home.js'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref, toRefs } from 'vue'
import { Iphone, Location, OfficeBuilding, Tickets, User, Delete, Download, Plus } from '@element-plus/icons-vue'
import { getPerson, changePerson, getProfile } from '../../api/person'
export default {
  setup() {
    const BacSrc = ref('')
    const showMsg = ref(false)
    const dialogFormVisible = ref(false)
    const dialogPortrait = ref(false)
    const personForm = ref({
      name: '',
      phone: '',
      email: '',
      school: ''
    })
    const dataSet = reactive({
      uploadUrl: 'http://42.192.10.199:8976/personal/upload',
      imgUrl: '',
      header: { token: localStorage.getItem('token') }
    })
    onMounted(() => {
      getUrl()
    })
    //获取头像
    async function getUrl() {
      try {
        let res = await home.getUrl()
        showMsg.value = true
        dataSet.imgUrl = res.result
        BacSrc.value = res.result
      } catch (err) {
        console.error(err)
      }
    }
    //发送成功后重新获取头像
    function handleAvatarSuccess() {
      getUrl()
    }
    function beforeAvatarUpload(rawFile) {
      console.log('before')
      if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error('单张图片大小不能超过10MB!')
        return false
      }
      return true
    }
    // 获取个人信息
    function getInformation() {
      getPerson().then((res) => {
        // 打印返回值
        console.log(res)
        // 判断请求是否成功
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          personForm.value = res.result
          console.log(personForm)
        }
      })
    }
    // 修改个人信息
    function submit() {
      dialogFormVisible.value = false
      changePerson(personForm.value).then((res) => {
        // 打印返回值
        console.log(res)
        // 判断请求是否成功
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          alert(res.message)
        }
      })
    }

    // 获取头像
    function getPic() {
      let res = getProfile()
      imageUrl.value = res.result
    }
    return {
      Iphone,
      Location,
      OfficeBuilding,
      Tickets,
      User,
      Delete,
      Download,
      Plus,
      dialogFormVisible,
      dialogPortrait,
      personForm,
      handleAvatarSuccess,
      beforeAvatarUpload,
      getInformation,
      submit,
      dataSet,
      ...toRefs(dataSet),
      showMsg,
      BacSrc
    }
  },
  mounted() {
    this.getInformation()
  }
}
</script>

<style scoped>
body {
  background-color: #ffffff;
}
img {
  /* margin-left: 110px; */
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
/* 修改头像按钮 */
.portrait {
  position: relative;
  top: -27%;
  left: 10%;
}
/* 修改信息按钮 */
.infor {
  position: absolute;
  top: 105%;
  left: 45%;
}
.description {
  position: absolute;
  left: 25%;
  width: 60%;
}
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
/* 上传头像样式 */
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  position: relative;
  left: 100%;
  border: 1px dashed #409eff;
  border-radius: 12px;
}
.avatar-uploader {
  text-align: center;
}
</style>
