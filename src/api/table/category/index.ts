import {request} from "@/utils/service";
import type * as Item from "@/api/table/category/types/category";
import {CategoryData, CategoryResponseData} from "@/api/table/category/types/category";


export function createCategoryApi(data: CategoryData) {
  return request({
    url: "/item/addCategory",
    method: "post",
    data
  });
}

/** 删 */
export function deleteCategoryApi(ids: number[]) {
  return request({
    url: "/item/deleteCategory",
    method: "post",
    data: ids
  });
}

/** 改 */
export function updateCategoryApi(data: CategoryData) {
  return request({
    url: "/item/updateCategory",
    method: "post",
    data
  });
}

/** 查 */
export function getCategoryDataApi() {
  return request<CategoryResponseData>({
    url: "/admin/getCategory",
    method: "get",
  });
}

