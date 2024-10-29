<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
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
          <el-table-column prop="fileName" label="文件名" align="center" width="400"/>
          <el-table-column prop="avatar" label="图片" align="center">
            <template #default="scope">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.fileUrl"
                :preview-src-list="[scope.row.fileUrl]"
                hide-on-click-modal
                :preview-teleported="true"
              />
            </template>
          </el-table-column>
          <el-table-column prop="isAvatar" label="图片类别" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.isAvatar" type="success" size="mini">用户头像</el-tag>
              <el-tag v-else type="danger" size="mini">物品图片</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="上传时间" align="center" />
          <el-table-column label="更新时间" align="center">
            <template #default="scope">
              <span v-if="scope.row.updateTime">{{ scope.row.updateTime }}</span>
              <span v-else>暂无更新</span>
            </template>
          </el-table-column>

          <el-table-column label="上传者" align="center">
            <template #default="scope">
              <span v-if="scope.row.user && scope.row.user.name">{{ scope.row.user.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user.avatar" label="上传者头像" align="center">
            <template #default="scope">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.user.avatar"
                :preview-src-list="[scope.row.user.avatar]"
                hide-on-click-modal
                :preview-teleported="true"
              />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete([scope.row.fileName])">删除</el-button>
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

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { getFileDataApi, deleteFileDataApi } from "@/api/table/file";
import { type FileData } from "@/api/table/file/types/file";
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue";
import { usePagination } from "@/hooks/usePagination";
import { cloneDeep } from "lodash-es";
import { useUserStore } from "@/store/modules/user";

defineOptions({
  // 命名当前组件
  name: "FileManage"
});

const loading = ref<boolean>(false);
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();
const token = useUserStore().token;

//#region 删
const selectedRows = ref<FileData[]>([]);

const handleDelete = (filenames: string[]) => {
  ElMessageBox.confirm("确认删除？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteFileDataApi(filenames).then(() => {
      ElMessage.success("删除成功");
      getTableData();
    });
  });
};

const handleSelectionChange = (selection: FileData[]) => {
  selectedRows.value = selection;
};

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }
  ElMessageBox.confirm(`正在删除 ${selectedRows.value.length} 条记录，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    const filenames = selectedRows.value.map(row => row.fileName);
    deleteFileDataApi(filenames).then(() => {
      ElMessage.success("删除成功");
      getTableData();
    });
  });
};

const tableData = ref<FileData[]>([]);

const getTableData = () => {
  loading.value = true;
  getFileDataApi()
    .then((data) => {
      paginationData.total = data.data.length;
      tableData.value = data.data;
    })
    .catch(() => {
      tableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
};

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
