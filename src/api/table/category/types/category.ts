
export interface CategoryData {
  id: number
  categoryName?: string
  updateTime?: string
  createTime?: string
}
export type CategoryResponseData = ApiResponseData<{
  list: CategoryData[]
}>
