import React, { useEffect, useState, useImperativeHandle } from "react";
import {
  Map as BaseMap,
  CoverView,
  CoverImage,
  Button,
  MapProps,
} from "@tarojs/components";
import { Toast } from "@taroify/core";
import Taro, { MapContext } from "@tarojs/taro";
import img from "@/assets/location.png";
import "./index.scss";
import QQMapWX from "@/labs/qqmap-wx-jssdk.min.js";
import { contain } from "@/api/map";
import { mapModel } from "@/store/models/map";

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
> = React.forwardRef(({ children, scrollIntoView, ...others }, ref) => {
  const [mapCtx, setMapCtx] = useState<MapContext>();
  const [location, setLocation] = useState<string>("");
  useEffect(() => {
    const ctx = Taro.createMapContext("myMap");
    setMapCtx(ctx);
    mapModel.get();
  }, []);
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
        maxScale={20}
        minScale={14}
        showLocation
        scale={14}
        id="myMap"
        polygons={[
          {
            points: points.map(([latitude, longitude]) => ({
              latitude,
              longitude,
            })),
            strokeWidth: 1,
            strokeColor: "#000",
            fillColor: "#A25E6B",
          },
        ]}
      >
        <CoverView className="location">
          <Button
            className="button"
            onClick={() => {
              Taro.getLocation({
                isHighAccuracy: true,
                complete: (res) => {
                  console.log(res);
                },
                success: async ({ latitude, longitude }) => {
                  const str = `${latitude},${longitude}`;
                  setLocation(str);
                  apiContain("34.282468,108.966244");
                },
                fail: () => {
                  apiContain(location);
                },
              });
            }}
          >
            <CoverImage className="img" src={img} />
          </Button>
        </CoverView>
        {children}
      </BaseMap>
      <Toast id="toast" />
    </>
  );
});

export default React.memo(Map);
