<script lang="ts" setup>
import {ref, reactive, watch, onMounted} from "vue"
import {ElMessage, ElMessageBox} from "element-plus"
import {Search, Refresh, CirclePlus, Delete, RefreshRight, Plus} from "@element-plus/icons-vue"
import {usePagination} from "@/hooks/usePagination"
import {useUserStore} from "@/store/modules/user"
import {getNoticeDataApi, deleteNoticeApi} from "@/api/table/notice"
import {type NoticeData} from "@/api/table/notice/types/notice"

// 定义组件选项
defineOptions({
  name: "NoticeManage"
})

// 加载状态
const loading = ref<boolean>(false)

// 分页数据
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()

// 获取用户 token
const token = useUserStore().token

// 搜索数据
const searchData = reactive({
  content: "",
  contact: ""
})

// 表格数据
const tableData = ref<NoticeData[]>([])

// 表单数据
const formData = reactive<NoticeData>({
  id: undefined,
  content: "",
  tradeTime: "",
  contact: "",
  authorId: undefined,
  author: {name: ""},
  itemId: undefined,
  confirm: 0,
  updateTime: "",
  recipientId: undefined
})


// 选中的行
const selectedRows = ref<NoticeData[]>([])

// 对话框显示状态
const dialogVisible = ref<boolean>(false)

// 获取通知数据
const getTableData = () => {
  loading.value = true
  getNoticeDataApi()
    .then((data) => {
      paginationData.total = data.total
      tableData.value = data.data
    })
    .catch(() => {
      ElMessage.error("获取通知数据失败")
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}


// 处理选择变化
const handleSelectionChange = (selection: NoticeData[]) => {
  selectedRows.value = selection
}

// 处理批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请至少选择一条记录")
    return
  }
  ElMessageBox.confirm(`正在删除 ${selectedRows.value.length} 条记录，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    const ids = selectedRows.value.map(item => item.id)
    deleteNoticeApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    }).catch(() => {
      ElMessage.error("删除失败")
    })
  }).catch(() => {
    ElMessage.info("已取消删除")
  })
}

// 处理单条删除
const handleDelete = (ids: number[]) => {
  ElMessageBox.confirm("确认删除该记录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteNoticeApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    }).catch(() => {
      ElMessage.error("删除失败")
    })
  }).catch(() => {
    ElMessage.info("已取消删除")
  })
}

// 处理启用/禁用
const handleProhibit = (id: number, status: number) => {
  // 这里可以添加启用/禁用的逻辑
  ElMessage.info("启用/禁用功能暂未实现")
}

// 处理重置密码
const handleResetPwd = (id: number) => {
  // 这里可以添加重置密码的逻辑
  ElMessage.info("重置密码功能暂未实现")
}

// 处理修改
const handleUpdate = (row: NoticeData) => {
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    content: "",
    tradeTime: "",
    contact: "",
    authorId: undefined,
    author: {name: ""},
    itemId: undefined,
    confirm: 0,
    updateTime: "",
    recipientId: undefined
  })
}

// 页面加载时获取数据
onMounted(() => {
  getTableData()
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="content" label="内容" align="center"/>
          <el-table-column prop="tradeTime" label="交易时间" align="center"/>
          <el-table-column prop="contact" label="联系方式" align="center"/>
          <el-table-column prop="author.name" label="作者" align="center" width="120"/>
          <el-table-column prop="author.avatar" label="作者头像" align="center" width="80">
            <template #default="scope">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.author.avatar"
                :preview-src-list="[scope.row.author.avatar]"
                hide-on-click-modal
                :preview-teleported="true"
              />
            </template>
          </el-table-column>

          <el-table-column prop="confirm" label="确认状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.confirm === 1" type="success" effect="plain">已确认</el-tag>
              <el-tag v-else type="warning" effect="plain">未确认</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center"/>
          <el-table-column prop="recipient.name" label="接收者姓名" align="center" width="120"/>
          <el-table-column prop="recipient.avatar" label="接收者头像" align="center" width="80">
            <template #default="scope">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.recipient.avatar"
                :preview-src-list="[scope.row.recipient.avatar]"
                hide-on-click-modal
                :preview-teleported="true"
              />
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :current-page="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
