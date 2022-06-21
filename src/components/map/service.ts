import Taro from "@tarojs/taro";

export async function contain(data: { location?: string }) {
  return Taro.request<Result>({
    url: '/place_cloud/search/contain',
    method: 'GET',
    data
  })
}