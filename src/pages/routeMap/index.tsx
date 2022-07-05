import React, { useEffect, useState } from "react";
import { View, MapProps, CoverView, CoverImage } from "@tarojs/components";
import { Map } from "@/components/index";
import "./index.scss";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";
import { useRouter } from "@tarojs/taro";
import yuan from "@/assets/marker/yuan.png";
import { wait } from "@/utils/index";
import { walking } from "@/api/map";

const minScale: number = 14.5;

const RouteMap: React.FC = () => {
  const router = useRouter();
  const [markers, setMarkers] = useState<MapProps.marker[]>([]);
  const [polyline, setPolyline] = useState<MapProps.polyline[]>([]);
  const [scale, setScale] = useState<number>(minScale);
  const mapState = useModel<MapState>(mapModel);
  const [center, setCenter] = useState<LocationCenter>({
    longitude: 0,
    latitude: 0,
  });
  useEffect(() => {
    if (mapState?.center) {
      const {
        center: [latitude, longitude],
      } = mapState;
      setScale(minScale);
      setCenter({
        latitude,
        longitude,
      });
    }
  }, [mapState, mapState?.center]);
  useEffect(() => {
    const { type } = router.params;
    const { lines } = mapState;
    if (type && (lines?.length ?? 0) > 0) {
      const find = lines?.filter((item) => item.type === type);
      if (find?.length > 0) {
        const [{ polyline }] = find;
        const format: string[][] = [];
        setMarkers(
          polyline.map((item, index) => {
            const [latitude, longitude] = item.split(",");
            return {
              id: index,
              latitude: Number(latitude),
              longitude: Number(longitude),
              iconPath: "?",
              width: 0,
              height: 0,
              customCallout: {
                display: "ALWAYS",
                anchorY: 0,
                anchorX: 0,
              },
              label: {
                fontSize: 12,
                padding: 5,
                content: "123",
                color: "#fff",
                bgColor: "#00000070",
                borderRadius: 2,
                textAlign: "center",
                anchorY: 1,
                anchorX: 0,
                x: 0,
                y: 0,
                borderColor: "none",
                borderWidth: 0,
              },
            };
          })
        );
        for (let i = 0; i < polyline.length; i++) {
          if (i === polyline.length - 1) {
            continue;
          } else {
            format.push([polyline[i], polyline[i + 1]]);
          }
        }
        (async () => {
          const polyline: MapProps.polyline[] = [];
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
              polyline.push({
                points,
                color: "#000000",
                width: 2,
              });
            }
            await wait(800);
          }
          setPolyline(polyline);
        })();
      }
    }
  }, [router.params, mapState.lines, mapState]);

  useEffect(() => {
    console.log(markers);
  }, [markers]);
  return (
    <View className="route">
      <Map
        scale={scale}
        minScale={minScale}
        maxScale={20}
        longitude={center.longitude}
        latitude={center.latitude}
        markers={markers}
        polyline={polyline}
      >
        <CoverView slot="callout">
          {markers.map(({ id }) => (
            <CoverView markerId={`${id}`} key={id} className="callout">
              <CoverImage src={yuan} className="background" />
              <CoverView className="text">{id}</CoverView>
            </CoverView>
          ))}
        </CoverView>
      </Map>
    </View>
  );
};

export default RouteMap;
