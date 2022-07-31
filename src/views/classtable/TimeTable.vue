<template>
  <div class="header">
    <div>
      <div class="date">
        <span class="span">第</span>
        <el-select v-model="state" class="semester" placeholder="Select" @change="getList">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" /> </el-select
        ><span class="span">学期</span>
      </div>
      <div class="date">
        <span class="span">第</span>
        <el-input-number v-model="week.msg.curWeek" :min="1" :max="25" @change="updataCurWeek" /><span class="span">周</span>
      </div>
    </div>
    <el-button type="primary" class="addExcel" @click="showForm = true">导入Excel表</el-button>
  </div>

  <!-- 课表组件 -->
  <div class="class-table">
    <div class="table-wrapper">
      <div class="tabel-container">
        <table>
          <thead>
            <tr>
              <!--第一行即每周地那一天-->
              <th v-for="(item, index) in weeks" :key="index">{{ item ? '周' + item : '' }}</th>
            </tr>
          </thead>
          <tbody>
            <!--循环创建课表框架-->
            <tr v-for="(item, index) in courses" :key="index">
              <td style="font-size: 12px; background: #d4f7fd; word-wrap: break-word; word-break: break-all">
                {{ changeCharacter(index) }}
              </td>

              <td v-for="innerItem in item" :key="innerItem.id" @click="toScanDetail(innerItem.id)">
                <div>
                  <Tabledialog
                    ref="table"
                    :innerItem="getData(innerItem.id)"
                    :count="innerItem.id"
                    :state="state"
                    v-on:updataLesson="getList"
                  ></Tabledialog>
                  <p
                    v-show="temp.data.className"
                    :class="
                      temp.data.endWeek >= week.msg.curWeek && temp.data.startWeek <= week.msg.curWeek ? 'cousercolor1' : 'cousercolor2'
                    "
                  >
                    {{ temp.data.className }}
                    <br />
                    {{ temp.data.classTime }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- 添加excel表单 -->
  <el-dialog v-model="showForm" title="上传" width="30%" center>
    <el-upload
      class="upload-demo"
      drag
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :limit="1"
      accept=".xls"
      :file-list="fileList"
      :auto-upload="false"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <!-- <el-icon v-if="!showIcon"><Document /></el-icon> -->
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip">请传.xls文件</div>
      </template>
    </el-upload>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" @click="uploadFile">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Tabledialog from '../../components/Tabledialog.vue'
import { reactive, ref } from '@vue/reactivity'
import { getTableList, getWeek, UpdateWeek, sendExcel,gatState,UpdateState } from '../../api/timeTable'
import { useRouter } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: {
    Tabledialog
  },
  setup(props,context) {
    let showForm = ref(false)
    let dialogVisible = ref(false)
    let fileList = reactive([])
    const weeks = reactive(['', '一', '二', '三', '四', '五', '六', '日'])
    let temp = reactive({ data: {} })
    let state = ref()
    //给每个单元格附上id
    const courses = reactive([
      [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
      [{ id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }],
      [{ id: 14 }, { id: 15 }, { id: 16 }, { id: 17 }, { id: 18 }, { id: 19 }, { id: 20 }],
      [{ id: 21 }, { id: 22 }, { id: 23 }, { id: 24 }, { id: 25 }, { id: 26 }, { id: 27 }],
      [{ id: 28 }, { id: 29 }, { id: 30 }, { id: 31 }, { id: 32 }, { id: 33 }, { id: 34 }],
      [{ id: 35 }, { id: 36 }, { id: 37 }, { id: 38 }, { id: 39 }, { id: 40 }, { id: 41 }]
    ])
    //学期
    const options = reactive([
      { value: 1, label: '一' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
      { value: 6, label: '六' },
      { value: 7, label: '七' },
      { value: 8, label: '八' }
    ])
    //当前路由
    const $router = useRouter()
    //列表数据
    let jsonData = reactive({ data: [] })
    let week = reactive({ msg: {} })
    onMounted(() => {
      getStart()
    })
    //发送成功后重新获取文件
    function handleAvatarSuccess(res, file) {
      console.log(res, file)
    }
    //发送之前先判断
    function beforeAvatarUpload(file) {
      console.log(file)
      console.log('before')
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
      let size = file.size / 1024 / 1024
      if (extension !== 'xls') {
        ElMessage.error('只能上传后缀是.xls的文件')
      }
      if (size > 10) {
        ElMessage.error('单个文件大小不能超过10MB!')
      }
    }

  async function uploadFile(){
    if (fileList.length === 0){
        ElMessage.error('请上传文件')
      }
      else{
        if(jsonData.data.length!=0){
        ElMessageBox.confirm('您提交的课表存在冲突你真的额要提交吗？', '提交提醒', {
          distinguishCancelAndClose: true,
          confirmButtonText: '真的',
          cancelButtonText: '我再想想'
        })
          .then(async() => {
            //导入课程
              let form = new FormData()
              form.append('excelFile', fileList[0].raw)
              form.append('state', state.value)
              let ans = await sendExcel(form)
              showForm.value = false
              if (ans.message == '成功')
                ElMessage({
                  message: '上传成功！',
                  type: 'success'
                })
                //刷新页面
                getList()
            })
          .catch((action) => {
            ElMessage({
              type: 'info',
              message: action === 'cancel' ? '已取消' : '取消失败'
            })
          })}

        else{         
          let form = new FormData()
          form.append('excelFile', fileList[0].raw)
          form.append('state', state.value)
          let ans = await sendExcel(form)
          showForm.value = false
          if (ans.message == '成功')
            ElMessage({
              message: '上传成功！',
              type: 'success'
            })
            //刷新页面
            getList()
        }
    }
  }

    //页面加载时调用的函数
    async function getStart(){
      let data = await gatState()
      state.value=data.result
      data =  await getTableList(state.value)
      jsonData.data=data.result
      data = await getWeek(state.value)
      week.msg= data.result
    }

    //选择学期时调用的方法
    function getList() {
      getTableList(state.value).then((res) => {
        jsonData.data = res.result
      })
      //更新数据库里的最新周
      UpdateState(state.value)
    }

    // 将数字转换成汉字
    function changeCharacter(num) {
      const characterArr = ['一', '二', '三', '四', '五', '六']
      return characterArr[num]
    }
    function getData(index) {
      for (let x = 0; x < jsonData.data.length; x++) {
        if (index == jsonData.data[x].num) {
          temp.data = jsonData.data[x]
          return temp.data
        }
      }
      temp.data = []
      return temp.data
    }
    
    //更新当前周
    function updataCurWeek() {
      console.log(week.msg)
      UpdateWeek(week.msg)
    }
    return {
      dialogVisible,
      courses,
      changeCharacter,
      weeks,
      jsonData,
      getData,
      temp,
      options,
      getList,
      state,
      updataCurWeek,
      week,
      showForm,
      handleAvatarSuccess,
      beforeAvatarUpload,
      fileList,
      uploadFile
    }
  },
  methods: {
    toScanDetail(index) {
      this.$refs.table[index].showdialog()
    }
  }
}
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow: auto;
  margin-bottom: 60px;
}
span {
  color: #677998;
}
table {
  table-layout: fixed;
  width: 100%;
  height: 60%;
  border-collapse: collapse;
  color: #677998;
}

thead {
  background: #d4f7fd;
}
th {
  font-weight: normal;
  height: 46px !important;
}
tbody {
  font-size: 12px;
}
td {
  text-align: center;
  height: 80px;
  border-right: 1px solid #fefefe;
  border-bottom: 1px solid #fefefe;
}

.cousercolor1 {
  background:  #a0cfff;
  width: 100%;
  height: 80px;
  color: #efefef;
  /* border-radius: 10px; */
  padding: 21px;
  box-sizing: border-box;
}

.cousercolor2 {
  background: #909399;
  width: 100%;
  height: 80px;
  color: #efefef;
  /* border-radius: 10px; */
  padding: 21px;
  box-sizing: border-box;
}
tr td div {
  width: 100%;
}
tr td:first-child {
  color: #333;
}
.addExcel {
  height: 30px;
  width: 100px;
}
.semester {
  width: 70px;
}
.span {
  font-size: 15px;
  font-weight: 800;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0;
}
.date {
  display: inline-block;
  margin-right: 20px;
}
.el-upload__tip {
  text-align: center;
}
</style>
