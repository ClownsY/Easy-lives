<template>
  <div class="showRecommend">
    <transition enter-active-class="animate__animated animate__zoomInRight" leave-active-class="animate__animated animate__zoomOut">
      <div v-show="isShow" class="ordered">{{ selected }}</div>
    </transition>
  </div>
  <div class="body">
    <div class="breakfast">
      <p>早餐</p>
      <div class="middle">
        <div class="rotate">
          <div class="backMsg">
            <div class="name">早餐列表</div>
            <ul>
              <li v-for="item in breakfast.msg" :key="item.id">
                <div class="list">
                  <div>
                    {{ item.food }}
                  </div>
                  <div>
                    <button class="update" @click="updateFood(item.id, item.food, item.type)">修改</button>
                    <button class="delete" @click="deleteFood(item.id, item.food, item.type)">删除</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="breakfastPic"></div>
        </div>
      </div>
      <el-button type="primary" round @click="orderBreakfast">开始推荐</el-button>
    </div>
    <div class="lunch">
      <p>午餐</p>
      <div class="middle2">
        <div class="rotate2">
          <div class="backMsg2">
            <div class="name">午餐列表</div>
            <ul>
              <li v-for="item in lunch.msg" :key="item.id">
                <div class="list">
                  <div>
                    {{ item.food }}
                  </div>
                  <div>
                    <button class="update" @click="updateFood(item.id, item.food, item.type)">修改</button>
                    <button class="delete" @click="deleteFood(item.id, item.food, item.type)">删除</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="lunchPic"></div>
        </div>
      </div>
      <el-button type="primary" round @click="orderLunch">开始推荐</el-button>
    </div>
    <div class="dinner">
      <p>晚餐</p>
      <div class="middle3">
        <div class="rotate3">
          <div class="backMsg3">
            <div class="name">晚餐列表</div>
            <ul>
              <li v-for="item in dinner.msg" :key="item.id">
                <div class="list">
                  <div>
                    {{ item.food }}
                  </div>
                  <div>
                    <button class="update" @click="updateFood(item.id, item.food, item.type)">修改</button>
                    <button class="delete" @click="deleteFood(item.id, item.food, item.type)">删除</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="dinnerPic"></div>
        </div>
      </div>
      <el-button type="primary" round @click="orderDinner">开始推荐</el-button>
    </div>
  </div>
  <div class="footer">
    <el-button type="success" size="large" @click="addFood()">添加</el-button>
  </div>
  <!-- 添加的表单 -->
  <el-dialog v-model="dialogFormVisible" title="添加食物" width="40%">
    <el-form :model="form" :rules="formRules" ref="addRef">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="food">
        <el-input v-model="form.food" autocomplete="off" />
      </el-form-item>
      <el-form-item label="种类" :label-width="formLabelWidth">
        <el-select v-model="form.type" placeholder="选择一个种类">
          <el-option label="早餐" value="早餐" />
          <el-option label="午餐" value="午餐" />
          <el-option label="晚餐" value="晚餐" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addIn">确认添加</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改的表单 -->
  <el-dialog v-model="showDetails" title="修改食物" width="40%">
    <el-form :model="updateFoodName" ref="updateRef" :rules="updateFoodNameRules">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="food">
        <el-input v-model="updateFoodName.food" autocomplete="off" />
      </el-form-item>
      <el-form-item label="种类" :label-width="formLabelWidth">
        <el-select v-model="updateFoodName.type" placeholder="选择一个种类">
          <el-option label="早餐" value="早餐" />
          <el-option label="午餐" value="午餐" />
          <el-option label="晚餐" value="晚餐" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDetails = false">取消</el-button>
        <el-button type="primary" @click="UpdateIn">确认修改</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 删除提示 -->
  <el-dialog v-model="showDeleteMsg" title="删除食物" width="40%">
    <span>确定删除 {{ updateFoodName.food }} 吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDeleteMsg = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<!-- 显示删除成功 -->
<script>
import { ElMessage } from 'element-plus'
import order from '@/api/order.js'
import { onMounted, reactive, ref } from 'vue'
export default {
  setup() {
    //添加表单的dom
    const addRef = ref(null)
    //修改表单的dom
    const updateRef = ref(null)
    //展示随机点到的食物
    let isShow = ref(false)
    //控制添加和删除列表展示
    const dialogFormVisible = ref(false)
    //控制修改列表展示
    const showDetails = ref(false)
    //控s制删除的提示信息栏出现
    const showDeleteMsg = ref(false)
    //存储随机点到的食物
    let selected = ref('鸡蛋')
    //添加食物
    const form = reactive({
      food: '',
      type: '早餐'
    })
    //添加食物的表单验证
    const formRules = reactive({
      food: [
        { required: true, message: '请输入', trigger: 'blur' },
        { min: 1, max: 10, message: '食物的名字不超过十个字', trigger: 'blur' }
      ]
    })
    //修改食物的表单验证
    const updateFoodNameRules = reactive({
      food: [{ min: 1, max: 10, message: '食物的名字不超过十个字', trigger: 'blur' }]
    })
    const formLabelWidth = '140px'
    let breakfast = reactive({ msg: [] })
    let lunch = reactive({ msg: [] })
    let dinner = reactive({ msg: [] })
    //查看详细信息时接受后端返回的数据
    let updateFoodName = reactive({
      food: '',
      type: '',
      id: 1
    })
    //获取全部食物信息
    onMounted(() => {
      getAllFood()
    })

    // 操作成功后的提示
    const showSuccess = (type) => {
      ElMessage({
        message: `${type}成功`,
        type: 'success'
      })
    }

    //操作失败后的提示
    const showError = (type) => {
      ElMessage.error(`${type}失败`)
    }

    //转换后端的全部食物的数据
    async function getAllFood() {
      try {
        let ans = await order.getAll()
        for (let i = 0; i < ans.result.length; i++) {
          for (let j = 0; j < ans.result[i].length; j++) {
            if (ans.result[i][j].type == 0) ans.result[i][j].type = '早餐'
            if (ans.result[i][j].type == 1) ans.result[i][j].type = '午餐'
            if (ans.result[i][j].type == 2) ans.result[i][j].type = '晚餐'
          }
        }
        breakfast.msg = ans.result[0]
        lunch.msg = ans.result[1]
        dinner.msg = ans.result[2]
      } catch (error) {
        console.error(error)
      }
    }

    //随机早餐
    function orderBreakfast() {
      if (isShow.value == false) {
        if (breakfast.msg.length == 0) {
          ElMessage.error('请先添加早餐')
        } else {
          let rand = Math.random() * breakfast.msg.length
          selected.value = breakfast.msg[Math.floor(rand)].food
        }
      }
      if (breakfast.msg.length != 0) isShow.value = !isShow.value
    }

    //随机午餐
    function orderLunch() {
      if (isShow.value == false) {
        if (lunch.msg.length == 0) {
          ElMessage.error('请先添加午餐')
        } else {
          let rand = Math.random() * lunch.msg.length
          selected.value = lunch.msg[Math.floor(rand)].food
        }
      }
      if (lunch.msg.length != 0) isShow.value = !isShow.value
    }

    //随机晚餐
    function orderDinner() {
      if (isShow.value == false) {
        if (dinner.msg.length == 0) {
          ElMessage.error('请先添加晚餐')
        } else {
          let rand = Math.random() * dinner.msg.length
          selected.value = dinner.msg[Math.floor(rand)].food
        }
      }
      if (dinner.msg.length != 0) isShow.value = !isShow.value
    }

    //删除食物前的赋值
    function deleteFood(id, food, type) {
      updateFoodName.id = id
      updateFoodName.food = food
      updateFoodName.type = type
      showDeleteMsg.value = true
    }

    //显示添加食物的表单
    function addFood() {
      dialogFormVisible.value = true
    }

    //添加食物的验证
    const addIn = () => {
      addRef.value.validate((valid) => {
        if (valid) {
          confirmAdd()
        } else {
          return false
        }
      })
    }

    //修改食物的验证
    const UpdateIn = () => {
      updateRef.value.validate((valid) => {
        if (valid) {
          confirmUpdate()
        } else {
          return false
        }
      })
    }

    //添加食物
    async function confirmAdd() {
      dialogFormVisible.value = false
      let midType = 0
      if (form.type == '午餐') {
        midType = 1
      } else if (form.type == '晚餐') {
        midType = 2
      }
      let addFood = {
        food: form.food,
        type: midType
      }
      try {
        let ans = await order.add(addFood)
        if (ans.message == '成功') showSuccess('添加')
        else showError('添加')
        getAllFood()
        addRef.value.resetFields()
      } catch (error) {
        console.error(error)
      }
    }

    //查看食物前的赋值
    function updateFood(id, food, type) {
      showDetails.value = true
      updateFoodName.food = food
      updateFoodName.id = id
      updateFoodName.type = type
    }

    //修改食物相关信息
    async function confirmUpdate() {
      showDetails.value = false
      let midType = 0
      if (updateFoodName.type == '午餐') {
        midType = 1
      } else if (updateFoodName.type == '晚餐') {
        midType = 2
      }
      let updateFood = {
        food: updateFoodName.food,
        type: midType,
        id: updateFoodName.id
      }
      try {
        let ans = await order.update(updateFood)
        if (ans.message == '成功') showSuccess('修改')
        else showError('修改')
        getAllFood()
      } catch (error) {
        console.error(error)
      }
    }

    //确定删除
    async function confirmDelete() {
      showDeleteMsg.value = false
      try {
        let ans = await order.del(updateFoodName.id)
        if (ans.message == '成功') showSuccess('删除')
        else showError('删除')
        getAllFood()
      } catch (error) {
        console.error(error)
      }
    }
    return {
      updateRef,
      addRef,
      showDeleteMsg,
      isShow,
      selected,
      dialogFormVisible,
      showDetails,
      form,
      formLabelWidth,
      breakfast,
      lunch,
      dinner,
      updateFoodName,
      formRules,
      updateFoodNameRules,
      orderBreakfast,
      orderLunch,
      orderDinner,
      addFood,
      confirmAdd,
      updateFood,
      confirmUpdate,
      deleteFood,
      confirmDelete,
      addIn,
      showSuccess,
      UpdateIn
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  margin-bottom: 10px;
}
.showRecommend {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  margin-bottom: 40px;
  background-color: #fceaff;
}
.body {
  text-align: center;
}
.backMsg,
.backMsg2,
.backMsg3 {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 300px;
  height: 300px;
  transition: all 2s ease-in -out;
  backface-visibility: hidden;
  transform: rotateY(-180deg);
  background-image: url(../assets/image/foodBac.jpg);
  background-repeat: no-repeat;
  overflow-y: auto;
}

.breakfastPic,
.lunchPic,
.dinnerPic {
  top: 0px;
  left: 0px;
  width: 300px;
  height: 300px;
  background-repeat: no-repeat;
  background-size: cover;
  transition: all 2s ease-in-out;
  backface-visibility: hidden;
}

.breakfastPic {
  background-image: url('../assets/image/breakfast.jpg');
}
.lunchPic {
  background-image: url('../assets/image/lunch.jpg');
}
.dinnerPic {
  background-image: url('../assets/image/dinner.jpg');
}
.breakfast,
.lunch,
.dinner {
  display: inline-block;
  text-align: center;
  margin: 0 10px;
}
.el-button {
  margin-top: 20px;
}
.ordered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 40px;
  font-size: 20px;
  text-align: center;
}
p {
  font-size: 30px;
  margin-bottom: 20px;
}

.breakfastPic,
.lunchPic,
.dinnerPic {
  position: absolute;
  top: 0px;
  left: 0px;
  backface-visibility: hidden;
}

.rotate,
.rotate2,
.rotate3 {
  position: relative;
  width: 300px;
  height: 300px;
  transform-style: preserve-3d;
  perspective: 500px;
  transition: all 1s ease-in-out;
}
.middle,
.middle2,
.middle3 {
  width: 300px;
  height: 300px;
  margin: 0 50px;
  transform-style: preserve-3d;
  perspective: 500px;
}
.middle:hover .rotate {
  transform: rotateY(180deg);
}
.middle2:hover .rotate2 {
  transform: rotateY(180deg);
}
.middle3:hover .rotate3 {
  transform: rotateY(180deg);
}
.footer {
  width: 200px;
  margin: 100px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.list {
  width: 250px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.update,
.delete {
  color: red;
}
.update {
  margin-right: 10px;
}
.name {
  font-size: 20px;
  margin-bottom: 10px;
}
</style>
