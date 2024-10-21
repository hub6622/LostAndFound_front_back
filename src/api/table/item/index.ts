import { request } from "@/utils/service";
import type * as Item from "@/api/table/item/types/item";

/** 增 */
export function createItemApi(data: Item.ItemData) {
  return request({
    url: "/item/addItem",
    method: "post",
    data
  });
}

/** 删 */
export function deleteItemApi(ids: number[]) {
  return request({
    url: "/item/deleteItem",
    method: "post",
    data: ids
  });
}

/** 改 */
export function updateItemApi(data: Item.ItemData) {
  return request({
    url: "/item/updateItem",
    method: "post",
    data
  });
}

/** 查 */
export function getItemDataApi() {
  return request<Item.ItemResponseData>({
    url: "/item/list",
    method: "get",
  });
}

export function getItemDataByParams(params:any){
  return request<Item.ItemResponseData>({
    url:"/item/getItemByParams",
    method:"get",
    params
  })
}
