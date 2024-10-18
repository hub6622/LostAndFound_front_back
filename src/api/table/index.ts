import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createUserDataApi(data: Table.CreateOrUpdateUserRequestData) {
  return request({
    url: "/admin/newUser",
    method: "post",
    data
  })
}

/** 删 */
export function deleteUserDataApi(ids: number[]) {
  return request({
    url: "/admin/delUsers",
    method: "post",
    data:  ids
  })
}

/** 改 */
export function updateUserDataApi(data: Table.CreateOrUpdateUserRequestData) {
  return request({
    url: "/admin/updateUser",
    method: "post",
    data
  })
}

/** 查 */
export function getUserDataApi() {
  return request<Table.UserResponseData>({
    url: "/admin/getAllUser",
    method: "get",
  })
}
/** 重置密码 */
export function resetPwdService(id:number){
  return request({
    url:"/admin/resetPwd/"+id,
    method:"post"
  })
}

export function handleProhibitService(id:number, status:number){
  return request({
    url:"/admin/prohibit",
    method:"post",
    data:{
      status: status,
      id: id
    }
  })
}
