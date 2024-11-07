<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { type UserData } from "@/api/table/user/types/user";
import { getUserInfoService } from "@/api/login/index";
import { ElCard, ElAvatar, ElTable, ElTableColumn, ElButton, ElLoading, ElMessage, ElTag } from 'element-plus';

const userInfo = ref<UserData>({
  name: '',
  email: '',
  avatar: '',
  phone: '',
  sex: 0,
});

const loading = ref(false);
const error = ref<string | null>(null);
const currentTime = ref(new Date().toLocaleTimeString());

const getUserInfo = async () => {
  loading.value = true;
  try {
    const result = await getUserInfoService();
    userInfo.value = result.data;
  } catch (err) {
    error.value = '获取用户信息失败';
    ElMessage.error('获取用户信息失败');
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  // 编辑个人信息的逻辑
  ElMessage.success('编辑个人信息功能暂未实现');
};

const viewDetails = () => {
  // 查看详细信息的逻辑
  ElMessage.success('查看详细信息功能暂未实现');
};

// 更新时间的函数
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

// 每秒更新时间
let intervalId: number;

onMounted(() => {
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

getUserInfo();
const getSexTagType = (sex: number): string => {
  switch (sex) {
    case 1:
      return 'primary';
    case 0:
      return 'danger';
    default:
      return 'info';
  }
};
</script>

<template>
  <div class="home-container">
    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <el-image v-if="userInfo.avatar"
                    :src="userInfo.avatar" class="user-avatar"
                    :preview-src-list="[userInfo.avatar]"
                    hide-on-click-modal
                    :preview-teleported="true"
          />
          <h1 class="welcome-message">欢迎您，管理员：{{ userInfo.name }}</h1>
        </div>
      </template>
      <div class="user-details">
        <el-table :data="[userInfo]" style="width: 100%">
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phone" label="电话" />
          <el-table-column label="性别">
            <template #default="scope">
              <el-tag :type="getSexTagType(scope.row.sex)">
                {{ (scope.row.sex === 1 ? '男' : '女') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="角色">
            <template #default="scope">
              <el-tag type="success">超级管理员</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="current-time">
      当前时间: {{ currentTime }}
    </div>
  </div>
</template>



<style scoped>
.home-container {
  padding: 40px;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.user-card {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.welcome-message {
  font-size: 28px;
  margin: 0;
}

.user-details {
  margin-top: 20px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.el-table {
  font-size: 18px;
}

.el-table th, .el-table td {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: left;
}

.el-table th {
  font-weight: bold;
}

.el-tag {
  font-size: 16px;
}

.current-time {
  margin-top: 40px; /* 增加与表格的距离 */
  font-size: 24px; /* 增大字体大小 */
  color: #555;
}
</style>
