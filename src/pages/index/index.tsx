import React, { FC, useCallback, useMemo, useRef, useEffect } from "react";
import { Flex, Button } from "@taroify/core";
import { Header } from "./components";
import { Map, MapHandle } from "@/components/index";
import { MapProps, Text, CoverView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";
import "./index.scss";
import jzw from "@/assets/marker/jzw.png";
import ljt from "@/assets/marker/ljt.png";
import fwd from "@/assets/marker/fwd.png";

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
    return values.map(({ title, location, x, create_time }) => ({
      title,
      id: create_time,
      latitude: location?.lat,
      longitude: location?.lng,
      // joinCluster: true,
      iconPath: (() => {
        switch (x.type) {
          case 1:
            return jzw;
          case 2:
            return ljt;
          default:
            return fwd;
        }
      })(),
      width: 33,
      height: 39,
      customCallout: {
        display: "BYCLICK",
        anchorY: 10,
        anchorX: 0,
      },
      ariaLabel: "0000",
      anchor: { x: 0, y: 1 },
      label: {
        fontSize: 12,
        padding: 5,
        content: title,
        color: "#fff",
        bgColor: "#00000070",
        borderRadius: 2,
        textAlign: "center",
        anchorX: (() => {
          switch (title.length) {
            case 1:
              return -2;
            case 2:
              break;
            case 3:
              return -6;
            case 4:
              return -12;
            case 5:
              break;
            case 6:
              return -26;
            default:
              break;
          }
          return 0;
        })(),
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
        >
          <CoverView slot="callout">
            {markers.map(({ id }) => (
              <CoverView markerId={`${id}`} key={id}>
                123
              </CoverView>
            ))}
          </CoverView>
        </Map>
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
