import React, { useEffect, useState, useMemo } from "react";
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
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";

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

const Map: React.FC<{ scrollIntoView: string }> = ({
  children,
  scrollIntoView,
}) => {
  const [location, setLocation] = useState<string>("");
  const map = useModel<MapState>(mapModel);
  useEffect(() => {
    mapModel.get();
  }, []);

  const markers = useMemo<MapProps.marker[]>(() => {
    const values = map?.[scrollIntoView] as LocationInfo[];
    console.log(values);
    return values.map(({ title, id, location }) => ({
      title,
      id,
      latitude: location?.lat,
      longitude: location?.lng,
    }));
  }, [scrollIntoView]);

  return (
    <>
      <BaseMap
        style={{
          width: "100%",
          height: "100%",
        }}
        longitude={108.93}
        latitude={34.27}
        showLocation
        scale={15}
        id="myMap"
        markers={markers}
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
};

export default React.memo(Map);
