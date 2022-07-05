type X = {
  type: number;
  scale: number;
  des: string;
  lines: string;
};

type Step = {
  instruction: string;
  polyline_idx: number[]; //路线在【路线坐标点串】数组中的下标0-9
  road_name: string; //道路名称(非必有)
  dir_desc: "东" | "南" | "西" | "北"; //路线方向
  distance: number; //路线距离（单位：米）
  act_desc: string;
};

declare type LocationCenter = {
  latitude: number;
  longitude: number;
};

declare type LocationInfo = {
  adcode?: number;
  address?: string;
  city?: string;
  create_time: number;
  district?: string;
  geometry_type?: number;
  id?: number;
  location: {
    lat: number;
    lng: number;
  };
  polygon?: string;
  province?: string;
  tel?: string;
  title: string;
  ud_id?: string;
  update_time?: number;
  x: X;
};

declare type Routes = {
  mode: "WALKING"; //出行方式
  distance: number; //方案总距离（单位：米）
  duration: number; //方案估算时间（含路况，单位：分钟）
  direction: "东" | "南" | "西" | "北"; //方案整体方向
  polyline: number[];
  steps: Step[];
};

type ResultData = {
  count: number;
  data: LocationInfo[];
};

declare interface Result<T = ResultData> {
  status?: number;
  request_id?: string;
  result: T;
  message?: string;
}
