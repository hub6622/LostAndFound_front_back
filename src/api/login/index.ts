import {request} from "@/utils/service"
import type * as Login from "./types/login"


/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "admin/login",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "admin/info",
    method: "get"
  })
}

export function getUserInfoService() {
  return request<any>({
    url: "/user/info",
    method: "get"
  })
}

export const confirmPasswordService = (pwd: string) => {
  return request<any>({
    url: '/user/confirmPwd',
    method: 'post',
    data:{
      pwd: pwd
    }
  })
}
export const changePasswordService = (params: any) => {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data: params
  })
}

