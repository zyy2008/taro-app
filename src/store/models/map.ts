import { defineModel } from 'foca';
import { list } from '@/api/map'

export type MapState = {
  building?: LocationInfo[],
  ashcan?: LocationInfo[],
  service?: LocationInfo[],
}

const initialState: MapState = {
  building: [],
  ashcan: [],
  service: []
}

export const mapModel = defineModel('map', {
  initialState,
  actions: {
    setState: (state, mapState: MapState) => {
      state.building = mapState.building ?? [];
      state.ashcan = mapState.ashcan ?? [];
      state.service = mapState.service ?? [];
    }
  },
  effects: {
    async get() {
      const { data } = await list();
      const { result } = data
      const building: LocationInfo[] = [], ashcan: LocationInfo[] = [], service: LocationInfo[] = [];
      if (result?.count ?? 0 > 0) {
        result?.data?.map((item) => {
          const { x } = item
          switch (x.type) {
            case 1:
              building.push(item)
              break;
            case 2:
              ashcan.push(item)
              break;
            case 3:
              service.push(item)
              break;
            default:
              break;
          }
        })
      }
      this.setState({
        building,
        ashcan,
        service
      });
    },
  }
});