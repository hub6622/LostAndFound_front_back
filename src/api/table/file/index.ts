import { request } from "@/utils/service"
import type * as Table from "@/api/table/file/types/file"

export function getFileDataApi(){
  return request<Table.FileResponseData>({
    url: "/file/findAll",
    method: "get"
  })
}
export function deleteFileDataApi(fileNames:String[]){
  return request({
    url: "/file/del",
    method: "post",
    data: fileNames
  })
}


