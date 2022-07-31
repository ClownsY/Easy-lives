<template>
  <div class="header">财务列表</div>
  <div class="searchHeader">
    <el-button @click="ListAdd" class="addIcon">
      <el-icon><Plus /></el-icon
    ></el-button>
    <div class="search_input">
      <div class="search-icon">
        <el-icon><search /></el-icon>
      </div>
      <el-input v-model="search" size="small" placeholder="请输入" />
    </div>
  </div>

  <el-table
    :data="tableData.data.filter((data) => !search || data.type.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column type="index" label="序号" width="100" />
    <el-table-column
      prop="time"
      label="日期"
      width="180"
      sortable
      column-key="time"
      :filters="timeFilterData"
      :filter-method="filterHandler"
    />
    <el-table-column
      prop="type"
      label="类型"
      width="180"
      sortable
      column-key="type"
      :filters="typeFilterData"
      :filter-method="filterHandler"
    />
    <el-table-column prop="amount" label="金额" />
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column prop="detail" label="描述" />
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button size="small" type="primary" @click="EditClick(scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="DeleteClick(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogFormVisible" :title="titleName" :show-close="false">
    <el-form :model="form" label-width="120px" :rules="Rules">
      <el-form-item label="支出/收入">
        <el-select v-model="form.status" placeholder="请选择" prop="status">
          <el-option label="支出" :value="1" />
          <el-option label="收入" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-input v-model="form.type" />
      </el-form-item>

      <el-form-item label="日期" prop="time">
        <el-col :span="11">
          <el-date-picker
            v-model="form.time"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            style="width: 100%"
          />
        </el-col>
        <!-- <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker v-model="form.date2" placeholder="请选择时间" style="width: 100%" />
      </el-col> -->
      </el-form-item>

      <el-form-item label="金额" prop="amount">
        <el-input v-model="form.amount" />
      </el-form-item>

      <el-form-item label="备注" prop="detail">
        <el-input v-model="form.detail" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="danger" @click="Cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFinanceList, updateFinanceList, deleteFinanceList } from '../../api/finance'
import { isNull } from 'lodash'
export default {
  setup() {
    /**
     * 财务列表
     */

    //初始化列表
    getList()

    //列表数据
    let tableData = reactive({ data: [] })
    function getList() {
      getFinanceList().then((res) => {
        let data = res.result
        //时间格式规范
        for (let i in data) {
          if (isNull(data[i].time)) continue
          let time = data[i].time.split(' ')
          data[i].time = time[0]
          data[i].createTime = time[0]
        }
        tableData.data = data
      })
    }

    //控制行颜色,支出为红，收入为绿
    function tableRowClassName({ row, rowIndex }) {
      if (row.status == 1) {
        return 'danger-row'
      } else if (row.status == 2) {
        return 'success-row'
      }
    }

    //判断是添加数据还是更新数据
    let flag = ref(1)

    //调用添加窗口
    function ListAdd() {
      flag.value = 1
      titleName.value = '添加窗口'
      dialogFormVisible.value = true
    }

    //编辑按钮
    function EditClick(row) {
      flag.value = 2
      titleName.value = '编辑窗口'
      dialogFormVisible.value = true
      form.status = row.status
      form.id = row.id
      form.time = row.time
      form.type = row.type
      if (row.amount < 0) {
        form.amount = -row.amount
      } else {
        form.amount = row.amount
      }

      form.detail = row.detail
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
          deleteFinanceList(id)
            .catch((res) => {
              flag = false
              ElMessage({
                type: 'warning',
                message: '删除失败'
              })
            })
            .then(() => {
              if (flag == true) {
                getList()
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

    //搜索内容
    let search = ref('')

    //表格筛选控制
    function filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    }

    //日期的过滤数据
    let timeFilterData = computed(() => {
      let timeTableData = JSON.parse(JSON.stringify(tableData.data))
      let timeData = []
      for (let i = 0; i < timeTableData.length; i++) {
        let data = {}
        data['text'] = timeTableData[i]['time']
        data['value'] = timeTableData[i]['time']
        timeData.push(data)
      }
      return timeData
    })

    //类型的过滤数据
    let typeFilterData = computed(() => {
      let typeTableData = JSON.parse(JSON.stringify(tableData.data))
      let typeData = []
      for (let i = 0; i < typeTableData.length; i++) {
        let data = {}
        data['text'] = typeTableData[i]['type']
        data['value'] = typeTableData[i]['type']
        typeData.push(data)
      }
      return typeData
    })

    /**
     * 添加、编辑窗口
     */

    //表单的标题
    let titleName = ref('')

    //控制窗口是否展示
    let dialogFormVisible = ref(false)

    //表单数据
    let form = reactive({
      id: null,
      status: 1,
      type: ' ',
      time: ' ',
      amount: null,
      detail: ' '
    })
    //表单验证规则
    const Rules = {
      type: [
        { required: true, message: '类型不能为空！', trigger: 'blur' },
        { min: 1, max: 40, message: '字数超过限制', trigger: 'blur' }
      ],
      time: { type: 'date', required: true, message: '请选择日期', trigger: 'blur' },
      amount: {
        validator: (rule, value, callback) => {
          if (!form.amount) {
            callback(new Error('金额不能为空'))
          } else if (
            form.amount.indexOf('.') != -1 &&
            (form.amount.split('.').length > 2 || form.amount.split('.')[0] === '' || form.amount.split('.')[1] === '')
          ) {
            callback(new Error('请输入正确格式的金额')) //防止输入多个小数点
          } else if (form.amount.indexOf('.') != -1 && form.amount.split('.')[1].length > 2) {
            callback(new Error('小数最多为两位')) //小数点后两位
          } else if (form.amount * 1 > 9999999999) {
            callback(new Error('最大9999999999')) // 限制最大额度
          } else {
            callback()
          }
        },
        required: true,
        trigger: 'blur'
      },
      detail: { min: 0, max: 50, message: '备注最长50字符', trigger: 'blur' }
    }

    //提交按钮
    function onSubmit() {
      ElMessageBox.confirm('确定提交吗?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let financeData = JSON.parse(JSON.stringify(form))
          let flag = true
          financeData['status'] = parseInt(financeData['status'])
          financeData['time'] = financeData['time'] + ' 00:00:00'
          updateFinanceList(financeData)
            .catch(() => {
              flag = false
              ElMessage({
                type: 'warning',
                message: '提交失败'
              })
            })
            .then(() => {
              if (flag == true) {
                getList()
                dialogFormVisible.value = false
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
      dialogFormVisible.value = false
      clearData()
    }

    //清除表单的数据
    function clearData() {
      form.id = null
      form.status = 1
      form.type = ''
      form.time = ''
      form.amount = null
      form.detail = ''
    }

    return {
      getList,
      tableData,
      tableRowClassName,
      ListAdd,
      EditClick,
      DeleteClick,
      dialogFormVisible,
      form,
      onSubmit,
      Cancel,
      clearData,
      search,
      titleName,
      filterHandler,
      timeFilterData,
      typeFilterData,
      Rules
    }
  }
}
</script>

<style lang="scss" scoped>
.searchHeader {
  /* position: relative;
   */
  display: flex;
  /* flex-wrap: nowrap; */
  justify-content: space-between;
}
.header {
  height: 100px;
  font-size: 22px;
  box-sizing: border-box;
  padding: 20px 0px 0px 10px;
  background-color: #f7f7f7;
  margin-bottom: 20px;
}
.search_input {
  display: flex;
  justify-content: space-between;
}

.search-icon {
  font-size: 20px;
  margin-top: 5px;
}
</style>
