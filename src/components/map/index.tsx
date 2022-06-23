import React, { useEffect, useState, useImperativeHandle } from "react";
import { Map as BaseMap, MapProps } from "@tarojs/components";
import { Toast, Button } from "@taroify/core";
import Taro, { MapContext } from "@tarojs/taro";
import "./index.scss";
import QQMapWX from "@/labs/qqmap-wx-jssdk.min.js";
import { contain } from "@/api/map";
import { mapModel } from "@/store/models/map";
import { Aim } from "@taroify/icons";

export type MapHandle = {
  mapCtx: MapContext;
};

const points: [number, number][] = [
  [34.303643, 108.955564],
  [34.304005, 108.969784],
  [34.281131, 108.971219],
  [34.280648, 108.956501],
];

const apiContain = async (location: string) => {
  const { data } = await contain({
    location,
  });
  const { result } = data;
  if (result?.count === 0) {
    Toast.open({
      message: "当前位置不在景区内",
    });
  }
};

const Map: React.FC<
  {
    scrollIntoView: string;
    children?: React.ReactNode;
  } & MapProps
> = React.forwardRef(
  ({ children, scrollIntoView, markers, ...others }, ref) => {
    const [mapCtx, setMapCtx] = useState<MapContext>();
    const [location, setLocation] = useState<string>("");
    useEffect(() => {
      const ctx = Taro.createMapContext("myMap");
      ctx.initMarkerCluster({
        enableDefaultStyle: false,
        zoomOnClick: true,
        gridSize: 60,
        fail: () => {
          console.log("聚合失败");
        },
        success: () => {
          console.log("聚合成功");
        },
      });
      setMapCtx(ctx);
      mapModel.get();
      ctx?.on("markerClusterCreate", (res: any) => {
        const clusters = res.clusters;
        console.log(res);
        const markers = clusters.map((cluster) => {
          const { center, clusterId, markerIds } = cluster;
          console.log(clusterId);
          return {
            ...center,
            width: 0,
            height: 0,
            clusterId, // 必须
            label: {
              content: markerIds.length + "",
              fontSize: 20,
              width: 60,
              height: 60,
              bgColor: "#00ff00",
              borderRadius: 30,
              textAlign: "center",
              anchorX: 0,
              anchorY: -30,
            },
          };
        });
        ctx.addMarkers({
          markers,
          clear: false,
          complete(res) {
            console.log("clusterCreate addMarkers", res);
          },
        });
      });
    }, []);

    useEffect(() => {
      if (mapCtx && markers && markers.length > 0) {
        mapCtx.addMarkers({
          markers,
          clear: false,
          success: () => {
            console.log("聚合点添加成功");
          },
          fail: () => {
            console.log("聚合点添加失败");
          },
        });
      }
    }, [markers, mapCtx]);

    useImperativeHandle<MapHandle, any>(ref, () => ({
      mapCtx,
    }));

    return (
      <>
        <BaseMap
          {...others}
          style={{
            width: "100%",
            height: "100%",
          }}
          // maxScale={20}
          // minScale={14}
          showLocation
          // scale={14}
          id="myMap"
          // polygons={[
          //   {
          //     points: points.map(([latitude, longitude]) => ({
          //       latitude,
          //       longitude,
          //     })),
          //     strokeWidth: 1,
          //     strokeColor: "#000",
          //     fillColor: "#A25E6B",
          //   },
          // ]}
        >
          {children}
        </BaseMap>
        <Button
          className="location"
          variant="text"
          icon={
            <Aim
              size={20}
              style={{
                margin: 0,
              }}
            />
          }
          onClick={() => {
            Taro.getLocation({
              isHighAccuracy: true,
              success: async ({ latitude, longitude }) => {
                const str = `${latitude},${longitude}`;
                setLocation(str);
                apiContain(str);
              },
              fail: () => {
                apiContain(location);
              },
            });
          }}
        />
        <Toast id="toast" />
      </>
    );
  }
);

export default React.memo(Map);
