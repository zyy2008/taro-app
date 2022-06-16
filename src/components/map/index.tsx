import React from "react";
import { Map as BaseMap, CoverView, CoverImage } from "@tarojs/components";
import Taro from "@tarojs/taro";
import img from "@/assets/location.png";
import "./index.scss";

const Map: React.FC = () => {
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
    >
      <CoverView
        className="location"
        onClick={() => {
          const mapCtx = Taro.createMapContext("myMap");
          mapCtx.moveToLocation({});
        }}
      >
        <CoverImage className="img" src={img} />
      </CoverView>
    </BaseMap>
  );
};

export default Map;
