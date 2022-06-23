import React, { FC, useCallback, useMemo, useRef, useEffect } from "react";
import { Flex, Button } from "@taroify/core";
import { Header } from "./components";
import { Map, MapHandle } from "@/components/index";
import { MapProps, Text, CoverView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";
import "./index.scss";
import jz from "@/assets/marker/jz.png";

const Index: FC = () => {
  const mapRef = useRef<MapHandle>(null);
  const [scrollIntoView, setScrollIntoView] =
    React.useState<string>("building");
  const map = useModel<MapState>(mapModel);
  const useScrollIntoView = useCallback((val) => {
    setScrollIntoView(val);
  }, []);

  const markers = useMemo<Omit<MapProps.marker, "label">[]>(() => {
    const values = map?.[scrollIntoView] as LocationInfo[];
    return values.map(({ title, id, location }) => ({
      title,
      id,
      latitude: location?.lat,
      longitude: location?.lng,
      iconPath: jz,
      width: 40,
      height: 40,
      label: {
        fontSize: 12,
        padding: 5,
        content: title,
        color: "#fff",
        bgColor: "rgba(0,0,0,.1)",
        borderRadius: 2,
        anchorY: -5,
        textAlign: "center",
        anchorX: -20,
      },
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
          overflow: "hidden",
        }}
      >
        <Map
          ref={mapRef}
          scrollIntoView={scrollIntoView}
          longitude={center.longitude}
          latitude={center.latitude}
          markers={markers}
        />
        <Button
          className="button"
          variant="text"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/lines/index",
            });
          }}
        >
          <Text className="text">游览线路</Text>
        </Button>
      </Flex.Item>
    </Flex>
  );
};

export default Index;
