import React, { FC, useCallback, useMemo, useRef, useEffect } from "react";
import { Flex } from "@taroify/core";
import { Header } from "./components";
import { Map, MapHandle } from "@/components/index";
import { CoverView, Button, MapProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";

import "./index.scss";

const Index: FC = () => {
  const mapRef = useRef<MapHandle>(null);
  const [scrollIntoView, setScrollIntoView] =
    React.useState<string>("building");
  const map = useModel<MapState>(mapModel);
  const useScrollIntoView = useCallback((val) => {
    setScrollIntoView(val);
  }, []);

  const markers = useMemo<MapProps.marker[]>(() => {
    const values = map?.[scrollIntoView] as LocationInfo[];
    return values.map(({ title, id, location }) => ({
      title,
      id,
      latitude: location?.lat,
      longitude: location?.lng,
      iconPath: "",
    }));
  }, [map, scrollIntoView]);
  const center = useMemo<LocationCenter>(() => {
    const {
      center: [latitude, longitude],
    } = map;
    return {
      latitude,
      longitude,
    };
  }, [map]);
  useEffect(() => {
    if (mapRef) {
      mapRef.current?.mapCtx?.moveToLocation(center);
    }
  }, [scrollIntoView, mapRef, center]);

  return (
    <Flex direction="column" className="home">
      <Flex.Item
        style={{
          width: "100%",
        }}
      >
        <Header
          scrollIntoView={scrollIntoView}
          setScrollIntoView={useScrollIntoView}
        />
      </Flex.Item>
      <Flex.Item
        style={{
          flex: 1,
          width: "100%",
          position: "relative",
        }}
      >
        <Map
          ref={mapRef}
          scrollIntoView={scrollIntoView}
          longitude={center.longitude}
          latitude={center.latitude}
          markers={markers}
        >
          <CoverView className="lines">
            <Button
              className="button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/lines/index",
                });
              }}
            >
              游览线路
            </Button>
          </CoverView>
        </Map>
      </Flex.Item>
    </Flex>
  );
};

export default Index;
