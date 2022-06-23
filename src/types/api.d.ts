
type X = {
  type: number
}

declare type LocationInfo = {
  adcode?: number,
  address?: string,
  city?: string,
  create_time?: number,
  district?: string,
  geometry_type?: number,
  id?: number,
  location: {
    lat: number,
    lng: number
  },
  polygon?: string,
  province?: string,
  tel?: string,
  title?: string,
  ud_id?: string,
  update_time?: number,
  x: X
}

type ResultData = {
  count?: number,
  data?: LocationInfo[]
}

declare interface Result<T = ResultData> {
  status?: number,
  request_id?: string,
  result?: T,
  message?: string
}