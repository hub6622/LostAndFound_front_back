<script lang="ts" setup>
import { reactive, ref, computed, watch } from "vue";
import {
  getCommentDataApi,
  deleteCommentApi,
  deleteReplyApi
} from "@/api/table/comment";
import { type CommentData, type CommentReplyData } from "@/api/table/comment/types/comment";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/modules/user";

// 定义组件选项
defineOptions({
  name: "CommentManage"
});

// 加载状态
const loading = ref<boolean>(false);

// 获取用户 token
const token = useUserStore().token;

// 默认表单数据
const DEFAULT_FORM_DATA: CommentData = {
  id: undefined,
  commentAuthor: { name: "" },
  commentTime: "",
  content: "",
  itemId: undefined,
  replies: []
};

// 选中的行
const selectedRows = ref<CommentData[]>([]);

// 评论数据
const comments = ref<CommentData[]>([]);
const commentReply = ref<CommentReplyData[]>([]);

// 评论分页数据
const commentPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 20, 30, 40]
});

// 回复分页数据
const replyPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: [10, 20, 30, 40]
});

// 计算当前页的评论数据
const paginatedComments = computed(() => {
  const start = (commentPagination.currentPage - 1) * commentPagination.pageSize;
  const end = start + commentPagination.pageSize;
  return comments.value.slice(start, end);
});

// 计算当前页的回复数据
const paginatedReplies = computed(() => {
  const start = (replyPagination.currentPage - 1) * replyPagination.pageSize;
  const end = start + replyPagination.pageSize;
  return commentReply.value.slice(start, end);
});

// 获取评论数据
const getCommentData = () => {
  loading.value = true;
  getCommentDataApi()
    .then((data) => {
      comments.value = data.data
      commentReply.value = data.data[0].commentReply

      // 更新分页总数
      commentPagination.total = comments.value.length;
      replyPagination.total = commentReply.value.length;
    })
    .catch(() => {
      comments.value = [];
      commentReply.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
};

// 处理删除评论
const handleCommentDelete = (ids: number[]) => {
  ElMessageBox.confirm("确认删除？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCommentApi(ids).then(() => {
      ElMessage.success("删除成功");
      getCommentData();
    });
  });
};

const handleReplyDelete = (ids: number[]) => {
  ElMessageBox.confirm("确认删除？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteReplyApi(ids).then(() => {
      ElMessage.success("删除成功");
      getCommentData();
    });
  });
};

// 处理选择变化
const handleCommentSelectionChange = (selection: CommentData[]) => {
  selectedRows.value = selection;
};

const handleReplySelectionChange = (selection: CommentReplyData[]) => {
  selectedRows.value = selection;
};

// 处理批量删除
const handleReplyBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }
  ElMessageBox.confirm(`正在删除 ${selectedRows.value.length} 条记录，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    const ids = selectedRows.value.map(row => row.id);
    deleteReplyApi(ids).then(() => {
      ElMessage.success("删除成功");
      getCommentData();
    });
  });
};

const handleCommentBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }
  ElMessageBox.confirm(`正在删除 ${selectedRows.value.length} 条记录，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    const ids = selectedRows.value.map(row => row.id);
    deleteCommentApi(ids).then(() => {
      ElMessage.success("删除成功");
      getCommentData();
    });
  });
};

// 初始化获取评论数据
getCommentData();

// 监听分页参数的变化
watch([() => commentPagination.currentPage, () => commentPagination.pageSize], () => {
  // 重新计算评论分页数据
});

watch([() => replyPagination.currentPage, () => replyPagination.pageSize], () => {
  // 重新计算回复分页数据
});
</script>

<template>
  <div>
    <el-card>
      <div class="toolbar-wrapper">
        <div>
          <el-button type="danger" :icon="Delete" @click="handleCommentBatchDelete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新数据" placement="top">
            <el-button icon="RefreshRight" type="primary" circle @click="getCommentData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <span>评论列表</span>
        <el-table :data="paginatedComments" @selection-change="handleCommentSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="commentAuthor.name" label="评论作者" align="center"/>
          <el-table-column prop="commentAuthor.avatar" label="头像" align="center">
            <template #default="scope">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.commentAuthor.avatar"
                :preview-src-list="[scope.row.commentAuthor.avatar]"
                hide-on-click-modal
                :preview-teleported="true"
              />
            </template>
          </el-table-column>
          <el-table-column prop="commentTime" label="评论时间" align="center"/>
          <el-table-column prop="content" label="评论内容" align="center">
            <template #default="scope">
              <span>{{ scope.row.content.slice(0, 20) }}{{ scope.row.content.length > 20 ? '...' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleCommentDelete([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="commentPagination.layout"
          :page-sizes="commentPagination.pageSizes"
          :total="commentPagination.total"
          :page-size="commentPagination.pageSize"
          :current-page="commentPagination.currentPage"
          @size-change="(size) => { commentPagination.pageSize = size; commentPagination.currentPage = 1; }"
          @current-change="(page) => { commentPagination.currentPage = page; }"
        />
      </div>
      <div class="toolbar-wrapper">
        <div>
          <el-button type="danger" :icon="Delete" @click="handleReplyBatchDelete">批量删除</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <span>回复列表</span>
        <el-table :data="paginatedReplies" @selection-change="handleReplySelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="replyAuthor.name" label="评论作者" align="center"/>
          <el-table-column prop="replyAuthor" label="头像" align="center">
            <template #default="scope">
              <el-image
                style="width: 40px; height: 40px"
                :src="scope.row.replyAuthor.avatar"
                :preview-src-list="[scope.row.replyAuthor.avatar]"
                hide-on-click-modal
                :preview-teleported="true"
              />
            </template>
          </el-table-column>
          <el-table-column prop="replyTime" label="评论时间" align="center"/>
          <el-table-column prop="content" label="评论内容" align="center">
            <template #default="scope">
              <span>{{ scope.row.content.slice(0, 20) }}{{ scope.row.content.length > 20 ? '...' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleReplyDelete([scope.row.id])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="replyPagination.layout"
          :page-sizes="replyPagination.pageSizes"
          :total="replyPagination.total"
          :page-size="replyPagination.pageSize"
          :current-page="replyPagination.currentPage"
          @size-change="(size) => { replyPagination.pageSize = size; replyPagination.currentPage = 1; }"
          @current-change="(page) => { replyPagination.currentPage = page; }"
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
