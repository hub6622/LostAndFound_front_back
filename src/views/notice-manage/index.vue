<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, CirclePlus, Delete, RefreshRight, Plus } from "@element-plus/icons-vue";
import { usePagination } from "@/hooks/usePagination";
import { useUserStore } from "@/store/modules/user";
import { getNoticeDataApi, deleteNoticeApi, addNoticeApi } from "@/api/table/notice";
import { type NoticeData } from "@/api/table/notice/types/notice";

// 定义组件选项
defineOptions({
  name: "NoticeManage"
});

// 加载状态
const loading = ref<boolean>(false);

// 分页数据
const { paginationData: normalPaginationData, handleCurrentChange: handleNormalCurrentChange, handleSizeChange: handleNormalSizeChange } = usePagination();
const { paginationData: systemPaginationData, handleCurrentChange: handleSystemCurrentChange, handleSizeChange: handleSystemSizeChange } = usePagination();

// 获取用户 token
const token = useUserStore().token;

// 表格数据
const allTableData = ref<NoticeData[]>([]);
const normalNotices = computed(() => {
  const start = (normalPaginationData.currentPage - 1) * normalPaginationData.pageSize;
  const end = start + normalPaginationData.pageSize;
  return allTableData.value.filter((item) => item.recipientId !== 0).slice(start, end);
});
const systemNotices = computed(() => {
  const start = (systemPaginationData.currentPage - 1) * systemPaginationData.pageSize;
  const end = start + systemPaginationData.pageSize;
  return allTableData.value.filter((item) => item.recipientId === 0).slice(start, end);
});

// 表单数据
const formData = reactive({
  content: "",
});

// 选中的行
const selectedRows = ref<NoticeData[]>([]);

// 对话框显示状态
const dialogVisible = ref<boolean>(false);

// 获取通知数据
const getTableData = () => {
  loading.value = true;
  getNoticeDataApi()
    .then((data) => {
      allTableData.value = data.data;
      normalPaginationData.total = data.data.filter((item) => item.recipientId !== 0).length;
      systemPaginationData.total = data.data.filter((item) => item.recipientId === 0).length;
    })
    .catch(() => {
      ElMessage.error("获取通知数据失败");
      allTableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
};

// 处理选择变化
const handleSelectionChange = (selection: NoticeData[]) => {
  selectedRows.value = selection;
};

// 处理批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }
  ElMessageBox.confirm(`正在删除 ${selectedRows.value.length} 条记录，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    const ids = selectedRows.value.map((item) => item.id);
    deleteNoticeApi(ids).then(() => {
      ElMessage.success("删除成功");
      getTableData();
    }).catch(() => {
      ElMessage.error("删除失败");
    });
  }).catch(() => {
    ElMessage.info("已取消删除");
  });
};

// 处理单条删除
const handleDelete = (ids: number[]) => {
  ElMessageBox.confirm("确认删除该记录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteNoticeApi(ids).then(() => {
      ElMessage.success("删除成功");
      getTableData();
    }).catch(() => {
      ElMessage.error("删除失败");
    });
  }).catch(() => {
    ElMessage.info("已取消删除");
  });
};

// 显示添加对话框
const showAddDialog = () => {
  dialogVisible.value = true;
  formData.content = "";
};

// 处理添加通知
const handleAddNotice = () => {
  console.log("noticeContent" + formData.content);
  addNoticeApi(formData.content).then(() => {
    ElMessage.success("通知发布成功");
    dialogVisible.value = false;
    getTableData();
  }).catch(() => {
    ElMessage.error("通知发布失败");
  });
};

// 页面加载时获取数据
onMounted(() => {
  getTableData();
});

// 监听分页参数的变化
watch([() => normalPaginationData.currentPage, () => normalPaginationData.pageSize], () => {
  getTableData();
}, { immediate: true });

watch([() => systemPaginationData.currentPage, () => systemPaginationData.pageSize], () => {
  getTableData();
}, { immediate: true });
</script>



<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="showAddDialog">发布通知</el-button>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <!-- 普通通知表格 -->
        <el-table :data="normalNotices" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="content" label="内容" align="center" />
          <el-table-column prop="tradeTime" label="交易时间" align="center" />
          <el-table-column prop="contact" label="联系方式" align="center" />
          <el-table-column prop="author.name" label="作者" align="center" width="120" />
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
          <el-table-column prop="updateTime" label="更新时间" align="center" />
          <el-table-column label="接收者姓名" align="center" width="120">
            <template #default="scope">
              {{ scope.row.recipient.name || '系统通知' }}
            </template>
          </el-table-column>
          <el-table-column prop="recipient.avatar" label="接收者头像" align="center" width="80">
            <template #default="scope">
              <el-image
                v-if="scope.row.recipient.avatar"
                style="width: 40px; height: 40px"
                :src="scope.row.recipient.avatar"
                :preview-src-list="[scope.row.recipient.avatar]"
                hide-on-click-modal
                :preview-teleported="true"
              />
              <span v-else>无头像</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager-wrapper">
          <el-pagination
            background
            :layout="normalPaginationData.layout"
            :page-sizes="normalPaginationData.pageSizes"
            :total="normalPaginationData.total"
            :page-size="normalPaginationData.pageSize"
            :current-page="normalPaginationData.currentPage"
            @size-change="handleNormalSizeChange"
            @current-change="handleNormalCurrentChange"
          />
        </div>
      </div>
      <div class="table-wrapper">
        <!-- 系统通知表格 -->
        <el-table :data="systemNotices" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="content" label="内容" align="center" />
          <el-table-column prop="author.name" label="作者" align="center" width="120" />
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
          <el-table-column prop="updateTime" label="更新时间" align="center" />
          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager-wrapper">
          <el-pagination
            background
            :layout="systemPaginationData.layout"
            :page-sizes="systemPaginationData.pageSizes"
            :total="systemPaginationData.total"
            :page-size="systemPaginationData.pageSize"
            :current-page="systemPaginationData.currentPage"
            @size-change="handleSystemSizeChange"
            @current-change="handleSystemCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="发布通知" width="30%">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="内容">
          <el-input v-model="formData.content" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddNotice">确 定</el-button>
        </span>
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
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
</style>
