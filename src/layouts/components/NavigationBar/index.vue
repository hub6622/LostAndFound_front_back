<script lang="ts" setup>
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/modules/app"
import { useSettingsStore } from "@/store/modules/settings"
import { useUserStore } from "@/store/modules/user"
import Hamburger from "../Hamburger/index.vue"
import Breadcrumb from "../Breadcrumb/index.vue"
import Sidebar from "../Sidebar/index.vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Screenfull from "@/components/Screenfull/index.vue"
import SearchMenu from "@/components/SearchMenu/index.vue"
import { useDevice } from "@/hooks/useDevice"
import { useLayoutMode } from "@/hooks/useLayoutMode"
import {reactive, ref} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {changePasswordService, confirmPasswordService, getUserInfoService} from "@/api/login/index";

const { isMobile } = useDevice()
const { isTop } = useLayoutMode()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { showNotify, showThemeSwitch, showScreenfull, showSearchMenu } = storeToRefs(settingsStore)

const userInfo = ref({
  id: 0,
  name: '',
  password: '',
  email: '',
  avatar: '',
  newPassword: '',
  reNewPassword: '',
})
const ruleFormRef = ref<FormInstance>()
const dialogFormVisible = ref(false)

const getUserInfo = async () => {
  const result = await getUserInfoService();
  userInfo.value = result.data;
}
getUserInfo()
const dialogFormVisibleSwitch = ()=>{
  dialogFormVisible.value = !dialogFormVisible.value
}
const confirmRePass = (rule:any, value:any, callback:any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== userInfo.value.newPassword) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}
const confirmRealPass = async (rule: any, value: any, callback: any) => {
  const result = await confirmPasswordService(value);
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else if (!result.data) {
    callback(new Error('密码错误'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  password: [
    {asyncValidator: confirmRealPass, trigger: 'blur', required: false}
  ],
  newPassword: [
    {required: false, message: '请输入新密码', trigger: 'blur'},
    {min: 8, max: 16, message: '请输入8-16位密码', trigger: 'blur'},
  ],
  reNewPassword: [
    {validator: confirmRePass, trigger: 'blur', required: false}
  ]
})
const changePassword = async () => {
  ElMessage.success("修改密码成功")
  await changePasswordService({
    password: userInfo.value.newPassword,
  });
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
/** 切换侧边栏 */
const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}

/** 登出 */
const logout = () => {
  userStore.logout()
  router.push("/login")
}
</script>

<template>
  <div class="navigation-bar">
    <Hamburger
      v-if="!isTop || isMobile"
      :is-active="appStore.sidebar.opened"
      class="hamburger"
      @toggle-click="toggleSidebar"
    />
    <Breadcrumb v-if="!isTop || isMobile" class="breadcrumb" />
    <Sidebar v-if="isTop && !isMobile" class="sidebar" />
    <div class="right-menu">
      <SearchMenu v-if="showSearchMenu" class="right-menu-item" />
      <Screenfull v-if="showScreenfull" class="right-menu-item" />
      <ThemeSwitch v-if="showThemeSwitch" class="right-menu-item" />

      <el-dropdown class="right-menu-item">
        <div class="right-menu-avatar">
          <el-avatar  :size="30" :src="userStore.avatar" />
          <span>{{ userStore.name }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-button type="primary" @click="dialogFormVisibleSwitch" style="width: 200px">修改密码</el-button>
            <el-dialog v-model="dialogFormVisible" title="联系对方信息" width="500">
              <el-form
                :label-position="'top'"
                ref="ruleFormRef"
                style="max-width: 300px"
                :model="userInfo"
                :rules="rules"
                label-width="auto"
                class="demo-ruleForm"
                :size="'default'"
                status-icon
                autocomplete="off"
              >
                <el-form-item prop="password">
                  <span>原密码:</span>
                  <el-input type="password" v-model="userInfo.password" autocomplete="off" placeholder="请输入原密码"/>
                </el-form-item>
                <el-form-item prop="newPassword">
                  <span>新密码:</span>
                  <el-input type="password" v-model="userInfo.newPassword" autocomplete="off" placeholder="请输入新密码"/>
                </el-form-item>
                <el-form-item prop="reNewPassword">
                  <span>确认新密码:</span>
                  <el-input type="password" v-model="userInfo.reNewPassword" autocomplete="off" placeholder="确认新密码"/>
                </el-form-item>
                <el-form-item>
                  <el-button style="margin-left: 80px;" type="primary" @click="changePassword">
                    修改
                  </el-button>
                  <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navigation-bar {
  height: var(--v3-navigationbar-height);
  overflow: hidden;
  color: var(--v3-navigationbar-text-color);
  display: flex;
  justify-content: space-between;
  .hamburger {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;
  }
  .breadcrumb {
    flex: 1;
    // 参考 Bootstrap 的响应式设计将宽度设置为 576
    @media screen and (max-width: 576px) {
      display: none;
    }
  }
  .sidebar {
    flex: 1;
    // 设置 min-width 是为了让 Sidebar 里的 el-menu 宽度自适应
    min-width: 0px;
    :deep(.el-menu) {
      background-color: transparent;
    }
    :deep(.el-sub-menu) {
      &.is-active {
        .el-sub-menu__title {
          color: var(--el-color-primary) !important;
        }
      }
    }
  }
  .right-menu {
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    .right-menu-item {
      padding: 0 10px;
      cursor: pointer;
      .right-menu-avatar {
        display: flex;
        align-items: center;
        .el-avatar {
          margin-right: 10px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
