import {UserData} from "@/api/table/user/types/user";
import {ItemData} from "@/api/table/item/types/item";

export interface FileData {
  id: number
  fileName: string
  userId: string
  itemId: number
  user: UserData
  item: ItemData
  fileUrl: string
  createTime: string
  updateTime: string
  isAvatar: number
}

export type FileResponseData = ApiResponseData<{
  list: FileData[]
}>
