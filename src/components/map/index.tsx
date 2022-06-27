import React, { useEffect, useState, useImperativeHandle } from "react";
import { Map as BaseMap, MapProps, BaseEventOrig } from "@tarojs/components";
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
        showLocation
        id="myMap"
        onMarkerTap={(res: BaseEventOrig<MapProps.onMarkerTapEventDetail>) => {
          const {
            detail: { markerId },
          } = res;
          const { markers } = others;
          const [{ latitude, longitude }] =
            markers?.filter(({ id }) => id === markerId) ?? [];
          mapCtx?.moveToLocation({
            latitude,
            longitude,
          });
          others?.onCalloutTap?.(res);
        }}
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
});

export default React.memo(Map);
