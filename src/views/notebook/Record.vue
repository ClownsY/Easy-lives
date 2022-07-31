<template>
  <!-- 头部部分 -->
  <div class="head">Todo-list</div>
  <!-- 事件列表 -->
  <div id="box">
    <!-- 左边的框架 -->
    <div class="box">
      <!-- 左部标题部分 -->
      <div class="title">
        <span :class="{ active: leftSelect === todoData.msg.length }" @click="selectAll(todoData.msg)">TODO</span>
        <span>{{ leftSelect ? leftSelect : 0 }}/{{ todoData.msg.length }}</span>
      </div>
      <!-- 左部搜索框部分 -->
      <div class="search_parent">
        <el-icon><search /></el-icon>
        <input
          class="search_input"
          v-model="sourceData"
          :class="heightLight ? 'search_input_focus' : ''"
          type="text"
          @focus="heightLight = true"
          @blur="heightLight = false"
          placeholder="请输入"
        />
        <el-icon class="addIcon" @click="ifShowAddListOfTodo = true"><plus /></el-icon>
      </div>

      <!-- 左部TODO事件部分 -->
      <div @drop="dropPub($event, 2)" @dragover.prevent class="left">
        <div
          @drag="ondrag"
          @dragstart="dragstart($event, item)"
          @dragend="dragend"
          draggable="true"
          class="hover-color"
          :class="{ active: item.isSelect }"
          v-on:click="cancelClick(todoData.msg, item.ids)"
          v-for="item in changeSourceData.msg"
          :key="item.ids"
        >
          <div class="thingOfName">{{ item.value }}</div>
          <span @click.stop="showTodoDetails(item)">...</span>
        </div>
      </div>
    </div>
    <!-- TODO 添加事件列表 -->
    <el-dialog v-model="ifShowAddListOfTodo" title="添加列表" width="30%" center>
      <el-form label-width="100px" :model="addFormOfTodo" style="max-width: 460px" :rules="Rules" ref="addTodoRef">
        <el-form-item label="名称" prop="value">
          <el-input v-model="addFormOfTodo.value" />
        </el-form-item>
        <el-form-item label="详细信息" prop="details">
          <el-input v-model="addFormOfTodo.details" type="textarea" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="addFormOfTodo.classify" placeholder="点击选择">
            <el-option label="学习" value="study" />
            <el-option label="生活" value="live" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            v-model="addFormOfTodo.deadline"
            type="datetime"
            placeholder="Pick a date"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="提醒时间">
          <el-date-picker
            v-model="addFormOfTodo.remindtime"
            type="datetime"
            placeholder="Pick a date"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ifShowAddListOfTodo = false">取消</el-button>
          <el-button type="primary" @click="addTodoIn">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- Todo详细信息列表 -->
    <el-dialog v-model="ifShowTodoDetails" title="详细信息" width="30%" center>
      <el-form label-width="100px" :model="todoDetails" style="max-width: 460px" :rules="Rules" ref="updateTodoRef">
        <el-form-item label="名称" prop="value">
          <el-input v-model="todoDetails.value" />
        </el-form-item>
        <el-form-item label="详细信息" prop="details">
          <el-input v-model="todoDetails.details" type="textarea" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="todoDetails.classify" placeholder="点击选择">
            <el-option label="学习" value="study" />
            <el-option label="生活" value="live" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            v-model="todoDetails.deadline"
            type="datetime"
            placeholder="Pick a date"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="提醒时间">
          <el-date-picker
            v-model="todoDetails.remindtime"
            type="datetime"
            placeholder="Pick a date"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ifShowTodoDetails = false">取消</el-button>
          <el-button type="primary" @click="updateTodoIn">修改</el-button>
          <el-button type="danger" @click="removeTodo">删除</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 中间按钮部分 -->
    <div class="middle">
      <div v-on:click="moveItem(doneData.msg, todoData.msg)" :class="{ active: rightSelect > 0 }">取消</div>
      <div v-on:click="moveItem(todoData.msg, doneData.msg)" :class="{ active: leftSelect > 0 }">完成</div>
    </div>
    <!-- Done 添加事件列表 -->
    <el-dialog v-model="ifShowAddListOfDone" title="添加列表" width="30%" center>
      <el-form label-width="100px" :model="addFormOfDone" style="max-width: 460px" ref="addDoneRef" :rules="Rules">
        <el-form-item label="名称" prop="value">
          <el-input v-model="addFormOfDone.value" />
        </el-form-item>
        <el-form-item label="详细信息" prop="details">
          <el-input v-model="addFormOfDone.details" type="textarea" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="addFormOfDone.classify" placeholder="点击选择">
            <el-option label="学习" value="study" />
            <el-option label="生活" value="live" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker v-model="addFormOfDone.deadline" type="datetime" placeholder="Pick a date" style="width: 100%" />
        </el-form-item>
        <el-form-item label="提醒时间">
          <el-date-picker
            v-model="addFormOfDone.remindtime"
            type="datetime"
            placeholder="Pick a date"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ifShowAddListOfDone = false">取消</el-button>
          <el-button type="primary" @click="addDoneIn">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- done详细信息列表 -->
    <el-dialog v-model="ifShowDoneDetails" title="详细信息" width="30%" center>
      <el-form label-width="100px" :model="doneDetails" style="max-width: 460px" :rules="Rules" ref="updateDoneRef">
        <el-form-item label="名称">
          <el-input v-model="doneDetails.value" />
        </el-form-item>
        <el-form-item label="详细信息">
          <el-input v-model="doneDetails.details" type="textarea" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="doneDetails.classify" placeholder="点击选择">
            <el-option label="学习" value="study" />
            <el-option label="生活" value="live" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间" prop="datetime">
          <el-date-picker
            v-model="doneDetails.deadline"
            type="datetime"
            placeholder="Pick a date"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="提醒时间">
          <el-date-picker
            v-model="doneDetails.remindtime"
            type="datetime"
            placeholder="Pick a date"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ifShowDoneDetails = false">取消</el-button>
          <el-button type="primary" @click="updateDoneIn">修改</el-button>
          <el-button type="danger" @click="removeDone">删除</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 右边的框架 -->
    <div class="box">
      <div class="title">
        <span :class="{ active: rightSelect === doneData.msg.length }" @click="selectAll(doneData.msg)">DONE</span>
        <span>{{ rightSelect ? rightSelect : 0 }}/{{ doneData.msg.length }}</span>
      </div>
      <!-- 右边的搜索框部分 -->
      <div class="search_parent">
        <el-icon><search /></el-icon>
        <input
          class="search_input"
          v-model="targetData"
          :class="heightLight1 ? 'search_input_focus' : ''"
          @focus="heightLight1 = true"
          @blur="heightLight1 = false"
          type="text"
          placeholder="请输入"
        />
        <el-icon class="addIcon" @click="ifShowAddListOfDone = true"><plus /></el-icon>
      </div>
      <!-- 右边的DONE事件部分 -->
      <div @drop="dropPub($event, 1)" @dragover.prevent class="right">
        <div
          class="hover-color"
          @drag="ondrag"
          @dragstart="dragstart($event, item)"
          @dragend="dragend"
          draggable="true"
          :class="{ active: item.isSelect }"
          v-on:click="cancelClick(doneData.msg, item.ids)"
          v-for="item in changeTargetData.msg"
          :key="item.ids"
        >
          <div class="thingOfName">{{ item.value }}</div>
          <span @click="showDoneDetails(item)">...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import record from '@/api/record.js'
import { ref, reactive, watch, getCurrentInstance, computed, toRaw, onMounted, onUnmounted } from 'vue'
export default {
  setup() {
    //$forceUpdate
    let { ctx: that } = getCurrentInstance()
    let addDoneRef = ref(null)
    let addTodoRef = ref(null)
    let updateTodoRef = ref(null)
    let updateDoneRef = ref(null)
    //显示详细信息的ids
    let onId = ref(0)
    let heightLight = ref(false)
    let heightLight1 = ref(false)
    //弹出todo的添加列表
    const ifShowAddListOfTodo = ref(false)
    //添加todo的列表
    const addFormOfTodo = reactive({
      ids: '',
      value: '',
      isSelect: false,
      details: '',
      classify: 'live',
      deadline: '',
      remindtime: ''
    })
    //弹出done的添加列表
    const ifShowAddListOfDone = ref(false)
    //添加done的列表
    const addFormOfDone = reactive({
      ids: '',
      value: '',
      isSelect: false,
      details: '',
      classify: 'live',
      deadline: '',
      remindtime: ''
    })
    //弹出todo详细信息列表
    const ifShowTodoDetails = ref(false)
    //弹出done详细信息列表
    const ifShowDoneDetails = ref(false)
    let todoData = reactive({
      msg: []
    })
    let doneData = reactive({
      msg: []
    })
    //todo和done的所有信息
    // let allData = reactive(toRaw(todoData.msg).concat(toRaw(doneData.msg)))
    let target = reactive({
      y: '',
      ids: ''
    })
    let sourceData = ref('')
    let targetData = ref('')
    let changeSourceData = reactive({ msg: [] })
    let changeTargetData = reactive({ msg: [] })
    changeSourceData.msg = toRaw(todoData.msg)
    changeTargetData.msg = toRaw(doneData.msg)
    //赋给新添加事件的ids
    let idNumber = todoData.msg.length + doneData.msg.length + 1
    //显示详细信息用的
    let todoDetails = reactive({
      value: '',
      details: '',
      classify: '',
      deadline: '',
      remindtime: ''
    })
    let doneDetails = reactive({
      value: '',
      details: '',
      classify: '',
      deadline: '',
      remindtime: ''
    })
    const Rules = {
      value: [
        { required: true, message: '请输入', trigger: 'blur' },
        { min: 1, max: 80, message: '名字过长', trigger: 'blur' }
      ],
      details: {
        min: 1,
        max: 100,
        message: '名字过长',
        trigger: 'blur'
      },
      deadline: { required: true, message: '日期不能为空!', trigger: 'blur', pattern: /.+/ }
    }
    onMounted(async () => {
      let ans = await record.getAll()
      todoData.msg = ans.result.todoData
      doneData.msg = ans.result.doneData
    })
    onUnmounted(async () => {
      console.log('todoData2', todoData)
      console.log('todoData.msg', todoData.msg)
      let allFood = {
        todoData: todoData.msg,
        doneData: doneData.msg
      }
      let ans = await record.sendAll(allFood)
    })
    // 操作成功后的提示
    const showSuccess = (type) => {
      ElMessage({
        message: `${type}成功`,
        type: 'success'
      })
    }
    const addTodoIn = () => {
      addTodoRef.value.validate((valid) => {
        if (valid) {
          addTodo()
        } else {
          return false
        }
      })
    }
    const addDoneIn = () => {
      addDoneRef.value.validate((valid) => {
        if (valid) {
          addDone()
        } else {
          return false
        }
      })
    }

    //监视todoData.msg的数据
    watch(todoData, (newValue, oldValue) => {
      changeSourceData.msg = toRaw(todoData.msg)
      idNumber = todoData.msg.length + doneData.msg.length + 1
    })

    //监视doneData.msg的数据
    watch(doneData, (newValue, oldValue) => {
      changeTargetData.msg = toRaw(doneData.msg)
      idNumber = todoData.msg.length + doneData.msg.length + 1
    })

    //监视todo搜索框里的输入
    watch(sourceData, (newValue, oldValue) => {
      let emptyArr = []
      if (newValue) {
        for (let i = 0; i < todoData.msg.length; i++) {
          if (todoData.msg[i].value.indexOf(newValue) != -1) {
            emptyArr.push(todoData.msg[i])
          }
        }
        changeSourceData.msg = emptyArr
      } else {
        changeSourceData.msg = toRaw(todoData.msg)
      }
    })

    //监视done搜索框里的输入
    watch(targetData, (newValue, oldValue) => {
      let emptyArr = []
      if (newValue) {
        for (let i = 0; i < doneData.msg.length; i++) {
          if (doneData.msg[i].value.indexOf(newValue) != -1) {
            emptyArr.push(doneData.msg[i])
          }
        }
        changeTargetData.msg = emptyArr
      } else {
        changeTargetData.msg = toRaw(doneData.msg)
      }
    })

    //拖拽过程中用target.y实时记录鼠标的位置
    function ondrag(event) {
      target.y = event.y
    }

    //区分时拖拽的todo区域还是done
    function dropPub(event, type) {
      if (type == 1) {
        drop(event, todoData.msg, doneData.msg)
      } else {
        drop(event, doneData.msg, todoData.msg)
      }
    }

    //删掉移走的框框数据，并添加给拖拽的目的地
    function drop(event, handle, targets) {
      let ids = event.dataTransfer.getData('ids')
      handle.forEach((item, index) => {
        if (item.ids == ids) {
          let temp = handle.splice(index, 1)
          temp[0].isSelect = false
          targets.push(temp[0])
        }
      })
      resort(event, targets)
    }

    function resort(event, targets) {
      //更新被拖拽和目的模块的y坐标，并将被拖拽的框框移到指定位置
      let eles = event.currentTarget.children
      // console.log(eles, eles[0].getBoundingClientRect())
      for (let i = 0; i < targets.length; i++) {
        if (targets[i].ids == target.ids) {
          targets[i].y = target.y
        } else {
          targets[i].y = eles[i].getBoundingClientRect().y
        }
      }

      //根据距离dom的距离，将移动的目标数组重新排序,110是每个事件的高
      for (let i = 0; i < targets.length - 1; i++) {
        for (let j = 0; j < targets.length - i - 1; j++) {
          if (targets[j].y > targets[j + 1].y) {
            let swap = targets[j]
            targets[j] = targets[j + 1]
            targets[j + 1] = swap
          }
        }
      }
      that.$forceUpdate()
    }

    //开始拖拽，将拖拽的框框的ids赋值给target，并将ids存入数据传输对象
    function dragstart(event, item) {
      target.ids = item.ids
      event.dataTransfer.setData('ids', item.ids)
    }

    //清楚数据传输对象的缓存
    function dragend(event) {
      event.dataTransfer.clearData()
    }

    //取消选中
    function cancelClick(data, ids) {
      data.forEach((element) => {
        if (element.ids == ids) {
          element.isSelect = !element.isSelect
        }
      })
    }

    //选中的元素移动
    function moveItem(handle, target) {
      let temp = handle.filter((item) => {
        return item.isSelect == true
      })
      if (temp.length <= 0) return false
      temp.forEach((item) => {
        let index = handle.indexOf(item)
        handle.splice(index, 1)
        item.isSelect = false
        target.push(item)
      })
    }

    //全选按钮
    function selectAll(data) {
      let isSelectAll = data.every((item) => {
        return item.isSelect == true
      })
      data.forEach((item) => {
        if (isSelectAll) {
          item.isSelect = false
        } else {
          item.isSelect = true
        }
      })
    }
    //展示todo的详情
    function showTodoDetails(item) {
      for (let i = 0; i < changeSourceData.msg.length; i++) {
        if (item == changeSourceData.msg[i]) onId.value = i
      }
      todoDetails.value = todoData.msg[onId.value].value
      todoDetails.details = todoData.msg[onId.value].details
      todoDetails.classify = todoData.msg[onId.value].classify
      todoDetails.deadline = todoData.msg[onId.value].deadline
      todoDetails.remindtime = todoData.msg[onId.value].remindtime
      ifShowTodoDetails.value = true
    }

    //展示done的详情
    function showDoneDetails(item) {
      ifShowDoneDetails.value = true
      for (let i = 0; i < changeTargetData.msg.length; i++) {
        if (item == changeTargetData.msg[i]) onId.value = i
      }
      doneDetails.value = doneData.msg[onId.value].value
      doneDetails.details = doneData.msg[onId.value].details
      doneDetails.classify = doneData.msg[onId.value].classify
      doneDetails.deadline = doneData.msg[onId.value].deadline
      doneDetails.remindtime = doneData.msg[onId.value].remindtime
    }

    //深拷贝
    function deepClone(source) {
      let sourceCopy = source instanceof Array ? [] : {}
      for (let item in source) {
        sourceCopy[item] = typeof source[item] === 'object' && source[item] ? deepClone(source[item]) : source[item]
      }
      return sourceCopy
    }

    //添加todo的事件
    function addTodo() {
      addFormOfTodo.ids = idNumber
      console.log(addFormOfTodo)
      todoData.msg.unshift(deepClone(addFormOfTodo))
      addFormOfTodo.classify = 'live'
      addFormOfTodo.ids = ''
      addFormOfTodo.value = ''
      addFormOfTodo.details = ''
      addFormOfTodo.deadline = ''
      addFormOfTodo.remindtime = ''
      ifShowAddListOfTodo.value = false
      showSuccess('添加')
    }

    //添加done的事件
    function addDone() {
      addFormOfDone.ids = idNumber
      doneData.msg.unshift(deepClone(addFormOfDone))
      addFormOfDone.classify = 'live'
      addFormOfDone.ids = ''
      addFormOfDone.value = ''
      addFormOfDone.details = ''
      addFormOfDone.deadline = ''
      addFormOfDone.remindtime = ''
      ifShowAddListOfDone.value = false
      showSuccess('添加')
    }

    //删除todo事件
    function removeTodoNext() {
      todoData.msg.splice(onId, 1)
      ifShowTodoDetails.value = false
    }

    //确认删除todo事件
    const removeTodo = () => {
      ElMessageBox.confirm('确定删除？', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        draggable: true
      }).then(() => {
        removeTodoNext()
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
      })
    }

    //删除done事件
    function removeDoneNext() {
      doneData.msg.splice(onId, 1)
      ifShowDoneDetails.value = false
    }

    //确认删除done事件
    const removeDone = () => {
      ElMessageBox.confirm('确定删除？', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        draggable: true
      }).then(() => {
        removeDoneNext()
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
      })
    }

    //todo详细信息编辑功能
    function todoEdit() {
      todoData.msg[onId.value].classify = todoDetails.classify
      todoData.msg[onId.value].value = todoDetails.value
      todoData.msg[onId.value].details = todoDetails.details
      todoData.msg[onId.value].deadline = todoDetails.deadline
      todoData.msg[onId.value].remindtime = todoDetails.remindtime
      ifShowTodoDetails.value = false
      showSuccess('修改')
    }

    //检查修改todo事件
    const updateTodoIn = () => {
      updateTodoRef.value.validate((valid) => {
        if (valid) {
          todoEdit()
        } else {
          return false
        }
      })
    }

    //done详细信息编辑共功能
    function doneEdit() {
      doneData.msg[onId.value].classify = doneDetails.classify
      doneData.msg[onId.value].value = doneDetails.value
      doneData.msg[onId.value].details = doneDetails.details
      doneData.msg[onId.value].deadline = doneDetails.deadline
      doneData.msg[onId.value].remindtime = doneDetails.remindtime
      ifShowDoneDetails.value = false
      showSuccess('修改')
    }

    //检查修改done事件
    const updateDoneIn = () => {
      updateDoneRef.value.validate((valid) => {
        if (valid) {
          doneEdit()
        } else {
          return false
        }
      })
    }

    //计算todo中的选中的个数
    let leftSelect = computed(() => {
      if (todoData.msg.length === 0) return false
      let arr = todoData.msg.filter((item) => {
        return item.isSelect == true
      })
      return arr.length
    })

    //计算done中的选中的个数
    let rightSelect = computed(() => {
      if (doneData.msg.length == 0) return false
      let arr = doneData.msg.filter((item) => {
        return item.isSelect == true
      })
      return arr.length
    })

    return {
      heightLight,
      heightLight1,
      todoData,
      doneData,
      target,
      sourceData,
      targetData,
      changeSourceData,
      changeTargetData,
      ifShowTodoDetails,
      ifShowDoneDetails,
      ifShowAddListOfTodo,
      addFormOfTodo,
      ifShowAddListOfDone,
      addFormOfDone,
      onId,
      todoDetails,
      doneDetails,
      addDoneRef,
      addTodoRef,
      updateTodoRef,
      updateDoneRef,
      Rules,
      ondrag,
      dropPub,
      drop,
      resort,
      dragstart,
      dragend,
      cancelClick,
      moveItem,
      selectAll,
      showTodoDetails,
      showDoneDetails,
      addTodo,
      addDone,
      removeTodo,
      removeDone,
      todoEdit,
      doneEdit,
      addTodoIn,
      addDoneIn,
      updateTodoIn,
      updateDoneIn,
      leftSelect,
      rightSelect
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  height: 100px;
  font-size: 22px;
  box-sizing: border-box;
  padding: 20px 0px 0px 10px;
  background-color: #f7f7f7;
  margin-bottom: 20px;
}
#box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  border: 1px solid rgb(235, 238, 245);
  height: 600px;
  border-radius: 10px;
}
.box .title {
  font-size: 15px;
  box-sizing: border-box;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
  width: 500px;
  height: 50px;
  line-height: 50px;
  background: #f7f7f7;
}
.box .title span:first-child {
  display: inline-block;
  background: #f5f7fa;
  background-image: url(../../assets/image/check-box-outline-blank.png);
  background-repeat: no-repeat;
  background-position: 10px 15px;
  background-size: 20px 20px;
  padding-left: 35px;
  cursor: pointer;
}
.box .title span:first-child.active {
  background-image: url(../../assets/image/check_box.png);
}
.left,
.right {
  width: 500px;
  height: 500px;
  padding: 5px 0;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #f7f7f7;
}
.left > div,
.right > div {
  cursor: pointer;
  text-align: left;
  background-image: url(../../assets/image/check-box-outline-blank.png);
  background-repeat: no-repeat;
  background-position: 10px 15px;
  background-size: 20px 20px;
  font-size: 14px;
  padding-left: 50px;
  padding-top: 15px;
  padding-bottom: 5px;
}
.left > div.active,
.right > div.active {
  background-image: url(../../assets/image/check_box.png);
}
.left > div.hover-color:hover,
.right > div.hover-color:hover {
  color: rgb(64, 158, 255);
}
.thingOfName {
  display: inline-block;
  padding-right: 60px;
}
.left > .hover-color,
.right > .hover-color {
  position: relative;
  height: 90px;
  font-size: 20px;
  line-height: 20px;
  background-color: white;
  border-radius: 10px;
  margin: 10px 10px;
}

.hover-color > span {
  position: absolute;
  right: 35px;
  top: 5px;
  font-size: 30px;
  height: 30px;
}
.middle {
  margin: 0 40px;
}
.middle > div {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
  font-size: 12px;
  background-color: #f5f7fa;
  color: #c0c4cc;
}
.middle > div.active {
  background-color: #409eff;
  border-color: #409eff;
  color: #ffffff;
}
.search_parent {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 10px;
  background-color: #f7f7f7;
}

.addIcon {
  position: absolute;
  right: 15px;
  cursor: pointer;
}
.search_input {
  width: 150px;
  height: 10px;
  border-bottom: 1px solid #ccc;
  background-color: #f7f7f7;
  outline: none;
  padding: 10px 0px 10px 10px;
  font-size: 14px;
}
.search_input_focus {
  border-bottom: 1px solid #409eff;
}
</style>
