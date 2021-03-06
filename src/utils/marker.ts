import { MapProps } from "@tarojs/components";
import jzw from "@/assets/marker/jzw.png";
import ljt from "@/assets/marker/ljt.png";
import fwd from "@/assets/marker/fwd.png";

export function markersFilter(
  values: LocationInfo[],
  {
    scale,
    minScale,
  }: {
    scale: number;
    minScale: number;
  }
): LocationInfo[] {
  return (
    values.filter(({ x }) => {
      return Math.round(scale - minScale + 1) >= x.scale;
    }) ?? []
  );
}

export function markersFormat(
  values: LocationInfo[],
  markerId: number
): MapProps.marker[] {
  return (
    values?.map(({ create_time, location, title, x }) => {
      const item: MapProps.marker = {
        id: create_time,
        latitude: location?.lat,
        longitude: location?.lng,
        zIndex: -1,
        iconPath: (() => {
          switch (x.type) {
            case 1:
              return jzw;
            case 2:
              return ljt;
            default:
              return fwd;
          }
        })(),
        width: 35,
        height: 41,
        anchor: { x: 0, y: 1 },
        label: {
          fontSize: 12,
          padding: 5,
          content: title,
          color: "#fff",
          bgColor: "#00000070",
          borderRadius: 2,
          textAlign: "center",
          anchorY: 1,
          x: 0,
          y: 0,
          borderColor: "none",
          borderWidth: 0,
          anchorX: (() => {
            switch (title.length) {
              case 1:
                return -2;
              case 2:
                break;
              case 3:
                return -6;
              case 4:
                return -12;
              case 5:
                break;
              case 6:
                return -26;
              default:
                break;
            }
            return 0;
          })(),
        },
      };
      if (markerId === create_time) {
        return {
          ...item,
          customCallout: {
            display: "ALWAYS",
            anchorY: 41,
            anchorX: 0,
          },
        };
      }
      return item;
    }) ?? []
  );
}
