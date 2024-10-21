import { UserData } from "@/api/table/user/types/user"

export interface ItemData {
  /** 物品ID */
  id?: number;
  /** 分类 */
  category?: string;
  /** 标题 */
  title?: string;
  /** 作者 */
  author?: UserData;
  /** 图片URL */
  picUrl?: string;
  /** 创建时间 */
  createTime?: string;
  /** 浏览次数 */
  viewCounts?: number;
  /** 评论次数 */
  commentCounts?: number;
  /** 内容 */
  content?: string;
  /** 评论ID */
  commentId?: number;
  /** 失物招领标志（0: 失物, 1: 招领） */
  lostOrFound?: number;
}
export type ItemResponseData = ApiResponseData<{
  list: ItemData[]
}>
