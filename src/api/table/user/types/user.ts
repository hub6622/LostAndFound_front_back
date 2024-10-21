export interface CreateOrUpdateUserRequestData {
  /** 查询参数：用户ID */
  id?: number;
  /** 查询参数：用户名 */
  name?: string;
  /** 查询参数：手机号 */
  phone?: string;
  /** 查询参数：头像 */
  avatar?: string;
  /** 查询参数：邮箱 */
  email?: string;
  /** 查询参数：性别 */
  sex?: number;
  /** 查询参数：状态 */
  status?: number;
  /** 查询参数：是否为管理员 */
  isAdmin?: number;
  /** 查询参数：创建时间 */
  createTime?: string;
  /** 查询参数：最后登录时间 */
  loginTime?: string;
}
export interface UserRequestData {
  /** 查询参数：用户ID */
  id?: number;
  /** 查询参数：用户名 */
  name?: string;
  /** 查询参数：手机号 */
  phone?: string;
  /** 查询参数：头像 */
  avatar?: string;
  /** 查询参数：邮箱 */
  email?: string;
  /** 查询参数：性别 */
  sex?: number;
  /** 查询参数：状态 */
  status?: number;
  /** 查询参数：是否为管理员 */
  isAdmin?: number;
  /** 查询参数：创建时间 */
  createTime?: string;
  /** 查询参数：最后登录时间 */
  loginTime?: string;
}


export interface UserData {
  /** 查询参数：用户ID */
  id?: number;
  /** 查询参数：用户名 */
  name?: string;
  /** 查询参数：手机号 */
  phone?: string;
  /** 查询参数：头像 */
  avatar?: string;
  /** 查询参数：邮箱 */
  email?: string;
  /** 查询参数：性别 */
  sex?: number;
  /** 查询参数：状态 */
  status?: number;
  /** 查询参数：是否为管理员 */
  isAdmin?: number;
  /** 查询参数：创建时间 */
  createTime?: string;
  /** 查询参数：最后登录时间 */
  loginTime?: string;
}

export type UserResponseData = ApiResponseData<{
  list: UserData[]
}>
