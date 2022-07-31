<template>
  <div class="header">资产总汇</div>
  <el-card class="box-card">
    <template #header>
      <div class="card-center">
        <span>净资产</span>
        <span>{{ netProp }}</span>
      </div>
    </template>
    <div class="card-top">
      <span>总资产 {{ totalProp }}</span>
      <span>总负债 {{ totalLiabilities }}</span>
    </div>
  </el-card>
  <div class="borrow">
    <el-button @click="borrow(true)" class="button">借入/待还 {{ totalBorrow1 }}</el-button>
    <el-button @click="borrow(false)" class="button">借出/待收 {{ totalBorrow2 }}</el-button>
  </div>

  <el-dialog v-model="dialogBorrowTableVisible" title="借入\代还">
    <el-button @click="addBorrow"
      ><el-icon><plus /></el-icon
    ></el-button>
    <el-table :data="borrowData.data" style="width: 100%">
      <el-table-column property="name" label="借款人" />
      <el-table-column property="repaid" :label="borrowFlag == true ? '已还' : '已收'" />
      <el-table-column property="borrow" :label="borrowFlag == true ? '借入' : '借出'" />
      <el-table-column property="sreturn" :label="borrowFlag == true ? '应还' : '应收'" />
      <el-table-column property="time" label="日期" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button size="small" type="primary" @click="EditClick(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="DeleteClick(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog v-model="dialogBorrowFormVisible" :title="titleName" :show-close="false">
    <el-form :model="form" label-width="120px" :rules="Rules">
      <el-form-item label="借款人" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="borrowFlag == true ? '已还' : '已收'" prop="repaid">
        <el-input v-model="form.repaid" />
      </el-form-item>
      <el-form-item :label="borrowFlag == true ? '借入' : '借出'" prop="borrow">
        <el-input v-model="form.borrow" />
      </el-form-item>
      <el-form-item label="日期" prop="time">
        <el-col :span="8">
          <el-date-picker
            v-model="form.time"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="danger" @click="Cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-card class="box-card">
    <div class="card-center">
      <span>资金账户</span>
      <span>{{ account }}</span>
    </div>
  </el-card>
</template>

<script>
import { ref, reactive } from 'vue'
import { getBorrow, updateBorrow, deleteBorrow, getAmount } from '../../api/finance'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isNull } from 'lodash'
export default {
  setup() {
    //净资产
    let netProp = ref(0.0)
    //总资产
    let totalProp = ref(0.0)
    //总负债
    let totalLiabilities = ref(0.0)
    //借入/待还
    let totalBorrow1 = ref(0.0)
    //借出/待收
    let totalBorrow2 = ref(0.0)
    //资金账户
    let account = ref(0.0)

    //获取统计的各个金额
    function getAllAmount() {
      getAmount().then((res) => {
        let data = res.result
        netProp.value = data.netProp
        totalProp.value = data.totalProp
        totalLiabilities.value = data.totalLiabilities
        totalBorrow1.value = data.totalBorrow1
        totalBorrow2.value = data.totalBorrow2
        account.value = data.account
      })
    }
    getAllAmount()
    /**
     * 借入\借出
     */
    //借入借出表格显示变量
    let dialogBorrowTableVisible = ref(false)
    //增加表单显示变量
    let dialogBorrowFormVisible = ref(false)
    //借入借出的判断标志
    let borrowFlag = ref(false)
    function getBorrowList() {
      getBorrow(borrowFlag.value).then((res) => {
        let data = res.result
        //时间格式规范
        for (let i in data) {
          if (isNull(data[i].time)) continue
          let time = data[i].time.split(' ')
          data[i].time = time[0]
        }
        borrowData.data = data
      })
    }

    //借入借出数据
    let borrowData = reactive({ data: [] })

    //表单数据
    let form = reactive({
      id: null,
      name: '',
      repaid: '0.00',
      borrow: null,
      time: ''
    })
    const Rules = {
      name: { required: true, message: '借款人姓名不能为空', trigger: 'blur' },
      repaid: {
        validator: (rule, value, callback) => {
          if (!form.repaid) {
            callback(new Error('金额不能为空'))
          } else if (
            form.repaid.indexOf('.') != -1 &&
            (form.repaid.split('.').length > 2 || form.repaid.split('.')[0] === '' || form.repaid.split('.')[1] === '')
          ) {
            callback(new Error('请输入正确格式的金额')) //防止输入多个小数点
          } else if (form.repaid.indexOf('.') != -1 && form.repaid.split('.')[1].length > 2) {
            callback(new Error('小数最多为两位')) //小数点后两位
          } else if (form.repaid * 1 > 9999999999) {
            callback(new Error('最大9999999999')) // 限制最大额度
          } else {
            callback()
          }
        },
        required: true,
        trigger: 'blur'
      },
      borrow: {
        validator: (rule, value, callback) => {
          if (!form.borrow) {
            callback(new Error('金额不能为空'))
          } else if (
            form.borrow.indexOf('.') != -1 &&
            (form.borrow.split('.').length > 2 || form.borrow.split('.')[0] === '' || form.borrow.split('.')[1] === '')
          ) {
            callback(new Error('请输入正确格式的金额')) //防止输入多个小数点
          } else if (form.borrow.indexOf('.') != -1 && form.borrow.split('.')[1].length > 2) {
            callback(new Error('小数最多为两位')) //小数点后两位
          } else if (form.borrow * 1 > 9999999999) {
            callback(new Error('最大9999999999')) // 限制最大额度
          } else {
            callback()
          }
        },
        required: true,
        trigger: 'blur'
      },
      time: { required: true, message: '请选择日期', trigger: 'blur' }
    }
    let titleName = ref('')
    //弹出借入借出表格按钮
    function borrow(flag) {
      dialogBorrowTableVisible.value = true
      borrowFlag.value = flag
      //根据flag获取借入或者借出的数据
      getBorrowList()
    }
    //添加或者编辑的标志
    let addFlag = ref(true)
    //添加借入借出数据按钮
    function addBorrow() {
      addFlag.value = true
      titleName.value = '添加'
      dialogBorrowFormVisible.value = true
    }

    //提交按钮
    function onSubmit() {
      //todo上传数据
      ElMessageBox.confirm('确定提交吗?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let BorrowData = JSON.parse(JSON.stringify(form))
          let flag = true
          BorrowData['borrowFlag'] = borrowFlag.value
          BorrowData['time'] = BorrowData['time'] + ' 00:00:00'
          updateBorrow(BorrowData)
            .catch(() => {
              flag = false
              ElMessage({
                type: 'warning',
                message: '提交错误'
              })
            })
            .then(() => {
              if (flag == true) {
                getBorrowList()
                getAllAmount()
                dialogBorrowFormVisible.value = false
                clearData()
                ElMessage({
                  type: 'success',
                  message: '提交成功'
                })
              }
            })
        })
        .catch(() => {
          ElMessage({
            type: 'warning',
            message: '提交取消'
          })
        })
    }

    //取消按钮
    function Cancel() {
      dialogBorrowFormVisible.value = false
      clearData()
    }

    //清除数据
    function clearData() {
      form.id = null
      form.name = ''
      form.repaid = '0.00'
      form.borrow = null
      form.time = ''
    }

    //编辑按钮
    function EditClick(row) {
      addFlag.value = false
      titleName.value = '编辑'
      dialogBorrowFormVisible.value = true
      //数据回显
      form.id = row.id
      form.name = row.name
      form.repaid = row.repaid
      form.borrow = row.borrow
      form.time = row.time
    }

    //删除按钮
    function DeleteClick(id) {
      let flag = true
      ElMessageBox.confirm('确认删除吗', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteBorrow(id)
            .catch(() => {
              flag = false
              ElMessage({
                type: 'warning',
                message: '删除错误'
              })
            })
            .then((res) => {
              console.log(id)
              if (flag == true) {
                getBorrowList()
                getAllAmount()
                ElMessage({
                  type: 'success',
                  message: '删除成功'
                })
              }
            })
        })
        .catch(() => {
          ElMessage({
            type: 'warning',
            message: '删除取消'
          })
        })
    }
    return {
      netProp,
      totalProp,
      totalLiabilities,
      dialogBorrowTableVisible,
      dialogBorrowFormVisible,
      borrowData,
      borrowFlag,
      borrow,
      addBorrow,
      EditClick,
      DeleteClick,
      form,
      onSubmit,
      Cancel,
      getBorrowList,
      titleName,
      account,
      totalBorrow1,
      totalBorrow2,
      Rules
    }
  }
}
</script>

<style lang="scss" scoped>
.netProp {
  font-size: 40px;
}
.totalProp {
  line-height: 100px;
  font-size: 20px;
}
.header {
  height: 100px;
  box-sizing: border-box;
  padding: 20px 0px 0px 10px;
  background-color: #f7f7f7;
  margin-bottom: 20px;
  font-size: 22px;
}
.card-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 150px;
}
.borrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  width: auto;
  margin-bottom: 50px;
}
.button {
  width: auto;
  height: auto;
  font-size: 40px;
}
span {
  font-size: 40px;
}
.box-card {
  width: auto;
  height: auto;
}
</style>
