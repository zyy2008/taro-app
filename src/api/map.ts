import Taro from "@tarojs/taro";

export async function contain(data: { location?: string }) {
  return Taro.request<Result>({
    url: "/place_cloud/search/contain",
    method: "GET",
    data,
  });
}

export async function list() {
  return Taro.request<Result>({
    url: "/place_cloud/data/list",
    method: "GET",
    data: {
      page_size: 100,
    },
  });
}

export async function walking(data: {
  from: string;
  to: string;
  waypoints?: string;
}) {
  return Taro.request<
    Result<{
      routes: Routes[];
    }>
  >({
    url: "/ws/direction/v1/walking",
    method: "GET",
    data,
  });
}
