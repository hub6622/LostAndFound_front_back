import { request } from "@/utils/service";
import type * as Comment from "@/api/table/comment/types/comment";


/** 删除评论 */
export function deleteCommentApi(ids: number[]) {
  return request({
    url: "/admin/deleteComment",
    method: "post",
    data: ids
  });
}
export function deleteReplyApi(ids: number[]) {
  return request({
    url: "/admin/deleteReply",
    method: "post",
    data: ids
  });
}

/** 获取评论列表 */
export function getCommentDataApi() {
  return request<Comment.CommentResponseData>({
    url: "/admin/commentList",
    method: "get",
  });
}
