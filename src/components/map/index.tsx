import React, { useEffect, useState } from "react";
import {
  Map as BaseMap,
  CoverView,
  CoverImage,
  Button,
} from "@tarojs/components";
import Taro, { MapContext } from "@tarojs/taro";
import img from "@/assets/location.png";
import "./index.scss";

const points: [number, number][] = [
  [34.303643, 108.955564],
  [34.304005, 108.969784],
  [34.281131, 108.971219],
  [34.280648, 108.956501],
];

const Map: React.FC = ({ children }) => {
  const [mapCtx, setMapCtx] = useState<MapContext>();
  useEffect(() => {
    const ctx = Taro.createMapContext("myMap");
    ctx.addGroundOverlay({
      id: 1,
      src: "https://static.runoob.com/images/demo/demo1.jpg",
      bounds: {
        southwest: {
          latitude: 34.30297,
          longitude: 108.97041,
        },
        northeast: {
          latitude: 34.280669,
          longitude: 108.956248,
        },
      },
      success: () => {
        console.log("成功");
      },
      fail: (e) => {
        console.log("失败");
        console.log(e);
      },
      complete: (e) => {
        console.log(e);
      },
    });
    setMapCtx(ctx);
  }, []);

  return (
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
            mapCtx?.moveToLocation({});
          }}
        >
          <CoverImage className="img" src={img} />
        </Button>
      </CoverView>
      {children}
    </BaseMap>
  );
};

export default Map;
