export interface LoginRequestData {
  /** admin 或 editor */
  name: "admin" | "editor"
  /** 密码 */
  password: string
}


export type LoginResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ name: string; roles: string[] }>
