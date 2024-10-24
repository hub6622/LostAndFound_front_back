<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  createItemApi,
  updateItemApi,
  getItemDataApi,
  deleteItemApi,
  getItemDataByParams
} from "@/api/table/item"
import { type ItemData } from "@/api/table/item/types/item"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"
import { useUserStore } from "@/store/modules/user"
import {CategoryData} from "@/api/table/category/types/category";
import {getCategoryDataApi} from "@/api/table/category";

defineOptions({
  // 命名当前组件
  name: "ItemManage"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const token = useUserStore().token

//#region 增
const DEFAULT_FORM_DATA: ItemData = {
  id: undefined,
  categories: [],
  title: "",
  author: { name: "" },
  picUrl: "",
  content: "",
  lostOrFound: 0
}
const categoryData = ref<CategoryData[]>([])
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<ItemData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<ItemData> = {
  categories: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  picUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  lostOrFound: [{ required: true, message: '请选择失物招领', trigger: 'change' }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id === undefined ? createItemApi : updateItemApi
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
const selectedRows = ref<ItemData[]>([])

const handleDelete = (ids: number[]) => {
  ElMessageBox.confirm("确认删除？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteItemApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
const handleSelectionChange = (selection: ItemData[]) => {
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
    deleteItemApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: ItemData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const tableData = ref<ItemData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  category: null,
  title: null
})
const getCategoryData = () => {
  getCategoryDataApi().then((data) => {
    categoryData.value = data.data
  })
}
const getTableData = () => {
  loading.value = true
  getItemDataApi()
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

const handleSearch = () => {
  const params = {
    category: searchData.category,
    title: searchData.title
  }
  paginationData.currentPage = 1
  getItemDataByParams(params)
    .then((data) => {
      paginationData.total = data.data.length
      tableData.value = data.data
    }).finally(
    () => {
      searchData.category = null
      searchData.title = null
    }
  )
}
getCategoryData()
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  getTableData()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], () => {
  getTableData()
}, { immediate: true })

const handleAvatarSuccess = (response: any) => {
  formData.value.picUrl = response.data
  ElMessage.success("上传图片成功")
}

const beforeAvatarUpload = (rawFile: File) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<template>
  <div>
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="标题">
          <el-input v-model="searchData.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="种类">
          <el-input v-model="searchData.category" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" @click="handleAdd">新增物品</el-button>
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
          <el-table-column label="分类" align="center">
            <template v-slot="scope">
              <el-tag v-for="category in scope.row.categories" :key="category" style="margin-right: 5px;">
                {{ category }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" align="center"/>
          <el-table-column prop="author.name" label="作者" align="center"/>
          <el-table-column prop="picUrl" label="图片" align="center">
            <template #default="scope">
              <el-image style="width: 40px; height: 40px;"
                        :src="scope.row.picUrl"
                        :preview-src-list="[scope.row.picUrl]"
                        hide-on-click-modal
                        :preview-teleported="true"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"/>
          <el-table-column prop="viewCounts" label="浏览次数" align="center"/>
          <el-table-column prop="commentCounts" label="评论次数" align="center"/>
          <el-table-column label="内容" align="center">
            <template #default="scope">
              <span>{{ scope.row.content.slice(0, 20) }}{{ scope.row.content.length > 20 ? '...' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lostOrFound" label="失物招领" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.lostOrFound === 0" type="danger" effect="plain">失物</el-tag>
              <el-tag v-else type="success" effect="plain">招领</el-tag>
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
      :title="formData.id === undefined ? '新增物品' : '修改'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="category" label="分类">
          <el-select v-model="formData.categories" multiple placeholder="请选择分类">
            <el-option v-for="category in categoryData" :key="category.id" :label="category.categoryName" :value="category.id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="标题">
          <el-input v-model="formData.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item prop="picUrl" label="图片">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            action="/api/upload"
            :headers="{'Authorization': token}"
          >
            <img v-if="formData.picUrl" :src="formData.picUrl" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item prop="content" label="内容">
          <el-input v-model="formData.content" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item prop="lostOrFound" label="失物招领">
          <el-select v-model="formData.lostOrFound" placeholder="请选择失物招领">
            <el-option label="失物" :value="0"/>
            <el-option label="招领" :value="1"/>
          </el-select>
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
