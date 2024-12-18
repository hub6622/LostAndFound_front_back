<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="用户名" align="center" />
          <el-table-column prop="roles" width="100" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.isAdmin === 1" type="primary" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">user</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center">
            <template #default="scope">
              <span>{{ scope.row.phone ? scope.row.phone : '暂无联系方式' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" align="center">
            <template #default="scope">
              <span>{{ scope.row.email ? scope.row.email : '暂无联系方式' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sex" width="60" label="性别" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.sex === 0" type="danger" effect="plain">女</el-tag>
              <el-tag v-else type="success" effect="plain">男</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="avatar" label="头像" align="center">
            <template #default="scope">
              <div v-if="scope.row.avatar">
                <el-image
                  style="width: 40px; height: 40px"
                  :src="scope.row.avatar"
                  :preview-src-list="[scope.row.avatar]"
                  hide-on-click-modal
                  :preview-teleported="true"
                />
              </div>
              <span v-else>无头像</span>
            </template>
          </el-table-column>
          <el-table-column prop="loginTime" label="最后登录时间" align="center">
            <template #default="scope">
              <span>{{ scope.row.loginTime ? scope.row.loginTime : '用户暂未登录过' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button type="success" text bg size="small" @click="handleProhibit(scope.row.id, 0)" v-if="scope.row.status === 0">启用账号</el-button>
              <el-button type="danger" text bg size="small" @click="handleProhibit(scope.row.id, 1)" v-else>禁用账号</el-button>
              <el-button type="primary" text bg size="small" @click="handleResetPwd(scope.row.id)">重置密码</el-button>
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :current-page="paginationData.currentPage"
          :page-size="paginationData.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增用户' : '修改'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="用户名">
          <el-input v-model="formData.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item prop="avatar" label="头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            action="/api/upload"
            :headers="{'Authorization': token}"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-select v-model="formData.sex" placeholder="请选择性别">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="isAdmin" label="权限">
          <el-select v-model="formData.isAdmin" placeholder="请选择权限">
            <el-option label="管理员" :value="1" />
            <el-option label="普通用户" :value="0" />
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

<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  createUserDataApi,
  updateUserDataApi,
  getUserDataApi,
  resetPwdService,
  handleProhibitService,
  deleteUserDataApi,
  getUserDataByParams
} from "@/api/table/user"
import { type CreateOrUpdateUserRequestData, type UserData } from "@/api/table/user/types/user"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"
import { useUserStore } from "@/store/modules/user"

defineOptions({
  // 命名当前组件
  name: "UserManage"
})

const total = ref(0);
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const token = useUserStore().token

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateUserRequestData = {
  id: undefined,
  name: "",
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateUserRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateUserRequestData> = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  isAdmin: [{ required: true, message: '请选择权限', trigger: 'change' }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id === undefined ? createUserDataApi : updateUserDataApi
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
//#endregion

//#region 删
const selectedRows = ref<UserData[]>([])

const handleDelete = (ids: number[]) => {
  ElMessageBox.confirm("确认删除？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteUserDataApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
const handleSelectionChange = (selection: UserData[]) => {
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
    deleteUserDataApi(ids).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

const handleProhibit = (id: number, status: number) => {
  const message = status === 1 ? "确定要禁用该用户吗？" : "确定要启用该用户吗？";
  ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    handleProhibitService(id, status).then(() => {
      ElMessage.success("修改状态成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: UserData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const tableData = ref<UserData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: null,
  phone: null
})


const getTableData = () => {
  loading.value = true;
  getUserDataApi()
    .then((data) => {
      total.value = data.data.length;
      const start = (paginationData.currentPage - 1) * paginationData.pageSize;
      const end = start + paginationData.pageSize;
      tableData.value = data.data.slice(start, end);
    })
    .catch(() => {
      tableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleAvatarSuccess = (result: any) => {
  formData.value.avatar = result.data;
  ElMessage.success("上传图片成功")
};

const beforeAvatarUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    ElMessage.error('只能上传 JPG 或 PNG 格式的图片');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB');
  }
  return isJpgOrPng && isLt2M;
};

const handleSearch = () => {
  const params = {
    username: searchData.username,
    phone: searchData.phone
  }
  paginationData.currentPage = 1
  getUserDataByParams(params)
    .then((data) => {
      tableData.value = data.data
    }).finally(
    () => {
      searchData.phone = null
      searchData.username = null
    }
  )
}

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  getTableData()
}

const handleResetPwd = (id: number) => {
  ElMessageBox.confirm("密码将重置为:12345678", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      resetPwdService(id)
        .then(() => {
          ElMessage.success("重置密码成功")
        })
    })
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], () => {
  getTableData();
}, { immediate: true });
</script>


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
