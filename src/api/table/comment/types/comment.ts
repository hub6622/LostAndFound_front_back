import { UserData } from "@/api/table/user/types/user"


export interface CommentData {
  /** 评论ID */
  id?: number;
  /** 评论作者 */
  commentAuthor?: UserData;
  /** 评论时间 */
  commentTime?: string;
  /** 评论内容 */
  content?: string;
  /** 评论顺序 */
  commentOrder?: number;
  /** 物品ID */
  itemId?: number;
  /** 评论回复列表 */
  commentReply?: CommentReplyData[];
}
export interface CommentReplyData {

  id?: number;

  replyAuthor?: UserData;

  replyTime?: string;
  content?: String;

  itemId?: number;

}


export type CommentReplyResponseData = ApiResponseData<{
  list: CommentReplyData[]
}>

export type CommentResponseData = ApiResponseData<{
  list: CommentData[]
}>
