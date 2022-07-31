<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><calendar /></el-icon>
          <span>未读消息</span>
        </span>
      </template>
      <el-table :data="unreadMessage" style="width: 100%">
        <el-table-column label="日期" prop="createTime" />
        <el-table-column label="主题" prop="title" />
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="small" @click="handleUnLook(scope.$index, scope.row), (dialogUnreadVisible = true)" type="primary"
              >查看</el-button
            >
            <el-button size="small" type="danger" @click="handleUnDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><DocumentChecked /></el-icon>
          <span>已读消息</span>
        </span>
      </template>
      <el-table :data="readMessage" style="width: 100%">
        <el-table-column label="日期" prop="createTime" />
        <el-table-column label="主题" prop="title" />
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="small" @click="handleLook(scope.$index, scope.row), (dialogReadVisible = true)" type="primary">查看</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
  <!-- 查看未读信息 -->
  <el-dialog v-model="dialogUnreadVisible" title="消息" width="30%" draggable>
    <div>
      内容: <span style="margin-left: 1%">{{ message }}</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="done">完成</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 查看已读消息 -->
  <el-dialog v-model="dialogReadVisible" title="消息" width="30%" draggable>
    <div>
      内容：<span style="margin-left: 1%">{{ message }}</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="done2">完成</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, inject } from 'vue'
import { getMessage, mark, deleteMessage } from '../../api/person'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const search = ref('')
    const dialogUnreadVisible = ref(false)
    const dialogReadVisible = ref(false)
    const unreadMessage = ref([])
    const readMessage = ref([])
    const message = ref('')
    const router = useRouter()
    function handleUnLook(index, row) {
      console.log(index, row)
      // 存储获取的消息内容
      message.value = row.content
      // 标记为已读
      console.log(row.id)
      mark(row.id).then((res) => {
        console.log(res)
        if (res.succeed != true) {
          alert(res.message)
        }
      })
    }
    function done() {
      dialogUnreadVisible.value = false
      refresh()
    }
    function done2() {
      dialogReadVisible.value = false
      refresh()
    }
    function handleUnDelete(index, row) {
      console.log(index, row)
      // 删除消息
      deleteMessage(row.id).then((res) => {
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          refresh()
        }
      })
    }
    function handleLook(index, row) {
      console.log(index, row)
      message.value = row.content
    }
    function handleDelete(index, row) {
      console.log(index, row)
      // 删除消息
      deleteMessage(row.id).then((res) => {
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          refresh()
        }
      })
    }
    // 获取未读信息
    function getUnread() {
      getMessage(1).then((res) => {
        // 打印返回值
        console.log(res)
        // 判断请求是否成功
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          res?.result.forEach((unRead) => {
            if()
            })
          })
        }
      })
    }
    // 刷新
    const refresh = inject('reload')
    // 获取已读信息
    function getRead() {
      getMessage(0).then((res) => {
        // 打印返回值
        console.log(res)
        // 判断请求是否成功
        if (res.succeed != true) {
          alert(res.message)
        } else if (res.succeed == true) {
          console.log(res.result)
          res?.result.forEach((Read) => {
            this.readMessage.push({
              id: Read.id,
              userId: Read.userId,
              title: Read.title,
              content: Read.content,
              flag: Read.status,
              createTime: Read.createTime
            })
          })
        }
      })
    }
    return {
      search,
      message,
      dialogUnreadVisible,
      dialogReadVisible,
      unreadMessage,
      readMessage,
      done2,
      handleUnLook,
      handleLook,
      handleUnDelete,
      handleDelete,
      getUnread,
      getRead,
      done,
      refresh
    }
  },
  mounted() {
    this.getUnread()
    this.getRead()
  }
}
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
