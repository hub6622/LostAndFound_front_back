import { UserData } from "@/api/table/user/types/user"

export interface NoticeData {
  id: number;
  content: string;
  tradeTime: string;
  contact: string;
  authorId: number;
  author: UserData;
  itemId: number;
  confirm: number;
  updateTime: string;
  recipientId: number;
  system: number;
  recipient: UserData;
}
export type NoticeResponseData = ApiResponseData<{
  list: NoticeData[]
}>
