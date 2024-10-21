import { request } from "@/utils/service"
import type * as Table from "@/api/table/notice/types/notice"

export function getNoticeDataApi(){
  return request<Table.NoticeResponseData>({
    url:"/admin/getAllNotice",
    method:"get"
  })
}

export function deleteNoticeApi(ids: number[]){
  return request({
      url: "/admin/delNotice",
    method: "post",
    data:  ids
  })
}
