export interface LoginRequestData {
  /** admin 或 editor */
  name: string
  /** 密码 */
  password: string
  avatar?: string
}


export type LoginResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ avatar: string; name: string; roles: string[] }>
