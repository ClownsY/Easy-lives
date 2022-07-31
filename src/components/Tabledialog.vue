<template>
  <div>
    <el-dialog v-model="dialogVisible" title="课程表详细信息" width="40%">
      <template>
        <el-dialog v-model="innerVisible" width="40%" title="课程表修改页面" append-to-body>
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize">
            <el-form-item label="课程名称" prop="className">
              <el-input type="text" v-model="ruleForm.className" />
            </el-form-item>
            <el-form-item label="教师名称" prop="teacher">
              <el-input type="text" v-model="ruleForm.teacher" />
            </el-form-item>
            <el-form-item label="上课时间" prop="classTime">
              <el-input type="text" v-model="ruleForm.classTime" />
            </el-form-item>
            <el-form-item label="教室" prop="classAddress">
              <el-input type="text" v-model="ruleForm.classAddress" />
            </el-form-item>
            <el-form-item label="开始周次" prop="startWeek">
              <el-input v-model.number="ruleForm.startWeek" />
            </el-form-item>
            <el-form-item label="结束周次" prop="endWeek">
              <el-input v-model.number="ruleForm.endWeek" />
            </el-form-item>
            <el-button @click="submitForm">确认</el-button>
            <el-button type="primary" @click="innerVisible = false">取消</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form>
        </el-dialog>
      </template>
      <template #footer>
        <div style="text-align: left !important; margin: 0 auto; color: #1016; font-size: 20px">
          <h1 v-show="innerItem.className">课程名称:{{ innerItem.className }}</h1>
          <h1 v-show="innerItem.classTime">上课时间:{{ innerItem.classTime }}</h1>
          <h1 v-show="innerItem.classAddress">上课地点:{{ innerItem.classAddress }}</h1>
          <h1 v-show="innerItem.teacher">授课老师:{{ innerItem.teacher }}</h1>
          <h1 v-show="innerItem.startWeek">课程课时:{{ innerItem.startWeek }}--{{ innerItem.endWeek }}</h1>
        </div>
        <br />
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">确认</el-button>
          <el-button type="primary" @click="copyData">修改</el-button>
          <el-button v-show="innerItem.className" @click="deletelesson(innerItem.id)">删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, unref } from '@vue/reactivity'
import { updateTableList, deleteTableList } from '../api/timeTable'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'Tabledialog',
  props: ['innerItem', 'count', 'state'],
  setup(props, context) {
    let ruleFormRef = ref(null)
    let formSize = ref('default')
    let ruleForm = reactive({
      id: null,
      userId: null,
      className: '',
      teacher: '',
      classTime: '',
      classAddress: '',
      num: null,
      state: null,
      startWeek: null,
      endWeek: null
    })
    //验证结束周次的函数
    const checkAge = (rule, value, callback) => {
      var leg = /^([1-9]|1[0-9]|2[0-5])$/
      if (!leg.test(value)) {
        return callback(new Error('请输入一个1-25的整数周次'))
      }
      setTimeout(() => {
        if (value < ruleForm.startWeek) {
          callback(new Error('输入的周次不能小于开始周次'))
        } else {
          callback()
        }
      }, 1000)
    }
    const rules = {
      className: [
        { required: true, message: 'Please input className', trigger: 'blur' },
        { min: 1, max: 18, message: '课程名称应为1-18位的字符串', trigger: 'blur' }
      ],
      teacher: [
        { required: false, message: 'Please input teacher', trigger: 'blur' },
        { max: 6, message: '教师名称请不要超过6位', trigger: 'blur' }
      ],
      classTime: [
        { required: false, message: 'Please input classTime', trigger: 'blur' },
        { max: 12, message: '上课时间请不要超过12位', trigger: 'blur' }
      ],
      classAddress: [
        { required: false, message: 'Please input classAddress', trigger: 'blur' },
        { max: 10, message: '上课地址请不要超过10位', trigger: 'blur' }
      ],
      startWeek: [
        { required: true, message: 'Please input startWeek', trigger: 'blur' },
        { pattern: /^([1-9]|1[0-9]|2[0-5])$/, message: '请输入1-25的整数', trigger: 'blur' }
      ],
      endWeek: [
        { required: true, message: 'Please input endWeek', trigger: 'blur' },
        { validator: checkAge, trigger: 'blur' }
      ]
    }
    let dialogVisible = ref(false)
    let innerVisible = ref(false)
    /**
     * 将props里inneritem的值赋给ruleFrom
     */
    function copyData() {
      ruleForm.id = props.innerItem.id
      ruleForm.userId = props.innerItem.userId
      ruleForm.num = props.count
      ruleForm.className = props.innerItem.className
      ruleForm.teacher = props.innerItem.teacher
      ruleForm.classTime = props.innerItem.classTime
      ruleForm.classAddress = props.innerItem.classAddress
      ruleForm.state = props.state
      ruleForm.startWeek = props.innerItem.startWeek
      ruleForm.endWeek = props.innerItem.endWeek
      innerVisible.value = true
    }

    //控制对话框是否显示
    function showdialog() {
      dialogVisible.value = true
    }
    //删除课程
    function deletelesson(num) {
      ElMessageBox.confirm('您是否要删除该课程', '删除提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          //删除课程
          deleteTableList(num).then(() => context.emit('updataLesson'))
          ElMessage({
            type: 'info',
            message: '删除成功'
          })
        })
        .catch((action) => {
          ElMessage({
            type: 'info',
            message: action === 'cancel' ? '已取消' : '取消失败'
          })
        })
      dialogVisible.value = false
    }

    //修改添加课程
    const submitForm = async () => {
      //修改课程
      var flag = true
      const form = unref(ruleFormRef)
      if (!form) return
      try {
        await form.validate()
      } catch (error) {
        console.log('出错了')
        flag = false
      }
      if (flag) {
        ElMessageBox.confirm('您确认要修改吗', '修改提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            //修改课程
            dialogVisible.value = false
            updateTableList(ruleForm).then(() => context.emit('updataLesson'))
            ElMessage({
              type: 'info',
              message: '修改成功'
            })
          })
          .catch((action) => {
            ElMessage({
              type: 'info',
              message: action === 'cancel' ? '已取消' : '取消失败'
            })
          })
        innerVisible.value = false
      }
    }

    function resetForm() {
      ruleForm.className = ''
      ruleForm.teacher = ''
      ruleForm.classTime = ''
      ruleForm.classAddress = ''
      ruleForm.startWeek = null
      ruleForm.endWeek = null
    }
    return {
      dialogVisible,
      showdialog,
      innerVisible,
      deletelesson,
      formSize,
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      resetForm,
      copyData,
      checkAge
    }
  }
}
</script>
<style scoped></style>
