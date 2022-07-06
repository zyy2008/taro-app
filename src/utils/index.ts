import type { Line } from "@/store/models/map";
import { walking } from "@/api/map";
import type { MapProps } from "@tarojs/components";

export type FormatLine = {
  duration: number;
  distance: number;
  polyline: MapProps.polyline[];
};

export const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export async function formatLine(
  polyline: Line["polyline"]
): Promise<FormatLine> {
  const format: string[][] = [];
  let duration: number = 0;
  let distance: number = 0;
  const line: MapProps.polyline[] = [];
  for (let i = 0; i < polyline.length; i++) {
    if (i === polyline.length - 1) {
      continue;
    } else {
      format.push([polyline[i], polyline[i + 1]]);
    }
  }

  for (const [from, to] of format) {
    const { data } = await walking({
      from,
      to,
    });
    const { result, status } = data;
    if (status === 0) {
      const points: LocationCenter[] = [];
      const { routes } = result;
      const [item] = routes;
      const coors = item.polyline;
      for (let i = 2; i < coors.length; i++) {
        coors[i] = coors[i - 2] + coors[i] / 1000000;
      }
      for (let i = 0; i < coors.length; i += 2) {
        points.push({
          latitude: coors[i],
          longitude: coors[i + 1],
        });
      }
      line.push({
        points,
        color: "#000000",
        width: 2,
      });
      duration = duration + item.duration;
      distance = distance + item.distance;
    }
    await wait(800);
  }

  return {
    duration,
    distance,
    polyline: line,
  };
}
