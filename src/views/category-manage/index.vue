<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  createCategoryApi,
  updateCategoryApi,
  getCategoryDataApi,
  deleteCategoryApi,
} from "@/api/table/category"
import { type CategoryData } from "@/api/table/category/types/category"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"
import { useUserStore } from "@/store/modules/user"

defineOptions({
  // 命名当前组件
  name: "CategoryManage"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const token = useUserStore().token

//#region 增
const DEFAULT_FORM_DATA: CategoryData = {
  id: undefined,
  name: "",
  description: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CategoryData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CategoryData> = {
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id === undefined ? createCategoryApi : updateCategoryApi
    const data = { ...formData.value, id: formData.value.id ?? -1 } // 确保 id 总是有值
    api(data)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getTableData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
const handleAdd = () => {
  dialogVisible.value = true
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 删
const selectedRows = ref<CategoryData[]>([])

const handleDelete = (ids: number[]) => {
  ElMessageBox.confirm("确认删除？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCategoryApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
const handleSelectionChange = (selection: CategoryData[]) => {
  selectedRows.value = selection;
};

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
    const ids = selectedRows.value.map(row => row.id)
    deleteCategoryApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: CategoryData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const tableData = ref<CategoryData[]>([])
const searchFormRef = ref<FormInstance | null>(null)

const getTableData = () => {
  loading.value = true
  getCategoryDataApi()
    .then((data) => {
      paginationData.total = data.data.length
      tableData.value = data.data
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], () => {
  getTableData()
}, { immediate: true })
</script>

<template>
  <div>
    <el-card>
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" @click="handleAdd">新增分类</el-button>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新数据" placement="top">
            <el-button icon="RefreshRight" type="primary" circle @click="getTableData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="categoryName" label="分类名称" align="center"/>
          <el-table-column prop="createTime" label="创建时间" align="center"/>
          <el-table-column label="更新时间" align="center">
            <template #default="scope">
              <span v-if="scope.row.updateTime">{{ scope.row.updateTime }}</span>
              <span v-else>暂无更新</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
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
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增分类' : '修改分类'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="分类名称">
          <el-input v-model="formData.categoryName" placeholder="请输入分类名称"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
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
