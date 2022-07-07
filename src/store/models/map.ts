import { defineModel } from "foca";
import { list } from "@/api/map";

export type Line = {
  title: string;
  type: string;
  tag: string;
  polyline: LocationInfo[];
};

export type MapState = {
  building?: LocationInfo[];
  ashcan?: LocationInfo[];
  service?: LocationInfo[];
  center: number[];
  lines: Line[];
};

const initialState: MapState = {
  building: [],
  ashcan: [],
  service: [],
  center: [],
  lines: [],
};

export const mapModel = defineModel("map", {
  initialState,
  actions: {
    setState: (state, mapState: MapState) => {
      state.building = mapState.building ?? [];
      state.ashcan = mapState.ashcan ?? [];
      state.service = mapState.service ?? [];
      state.center = mapState.center ?? [];
      state.lines = mapState.lines ?? [];
    },
  },
  effects: {
    async get() {
      const { data } = await list();
      const { result } = data;
      const building: LocationInfo[] = [],
        ashcan: LocationInfo[] = [],
        service: LocationInfo[] = [],
        center: number[] = [],
        lines: Line[] = [
          {
            title: "夏日纳凉路线",
            type: "1",
            tag: "夏日纳凉",
            polyline: [],
          },
          {
            title: "秋日赏银杏路线",
            type: "2",
            tag: "银杏路线",
            polyline: [],
          },
          {
            title: "宫廷历史生活线路",
            tag: "宫廷历史生活",
            type: "3",
            polyline: [],
          },
        ];
      if (result?.count ?? 0 > 0) {
        for (let i = 0; i < result.data?.length; i++) {
          const item = result.data[i];
          const { x, location } = item;
          switch (x.type) {
            case 0:
              center.push(...[location.lat, location.lng]);
              break;
            case 1:
              building.push(item);
              break;
            case 2:
              ashcan.push(item);
              break;
            case 3:
              service.push(item);
              break;
            default:
              break;
          }
          x.lines &&
            lines.forEach((line) => {
              const { type, polyline } = line;
              if (x.lines.indexOf(type) != -1) {
                line.polyline = [item, ...polyline];
              }
            });
        }
      }
      this.setState({
        building,
        ashcan,
        service,
        center,
        lines,
      });
    },
  },
});
