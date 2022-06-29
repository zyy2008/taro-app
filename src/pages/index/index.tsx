import React, {
  FC,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { Flex, Button } from "@taroify/core";
import { Header, MarkerInfo } from "./components";
import { Map, MapHandle } from "@/components/index";
import { MapProps, Text, CoverView, CoverImage } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";
import { markersFilter, markersFormat } from "@/utils/marker";
import "./index.scss";
import base from "@/assets/marker/base.png";
import img from "@/assets/1.jpg";

const minScale: number = 14.5;

const Index: FC = () => {
  const mapRef = useRef<MapHandle>(null);
  const [scale, setScale] = useState<number>(minScale);
  const [scrollIntoView, setScrollIntoView] = useState<string>("building");
  const [markerId, setMarkerId] = useState<number>();
  const mapState = useModel<MapState>(mapModel);
  const useScrollIntoView = useCallback((val) => {
    setScrollIntoView(val);
  }, []);

  const markers = useMemo<MapProps.marker[]>(() => {
    const values = mapState?.[scrollIntoView] as LocationInfo[];
    const filters = markersFilter(values, { scale, minScale });
    return markersFormat(filters);
  }, [mapState, scrollIntoView, scale]);

  const center = useMemo<LocationCenter>(() => {
    const {
      center: [latitude, longitude],
    } = mapState;
    return {
      latitude,
      longitude,
    };
  }, [mapState]);
  useEffect(() => {
    if (mapRef) {
      mapRef.current?.mapCtx?.moveToLocation(center);
    }
  }, [scrollIntoView, mapRef, center]);

  const marker = useMemo<LocationInfo | null>(() => {
    if (markerId && scrollIntoView) {
      const values = mapState?.[scrollIntoView] as LocationInfo[];
      const [item] = values.filter(
        ({ create_time }) => create_time === markerId
      );
      return item;
    }
    return null;
  }, [mapState, markerId, scrollIntoView]);

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
          scale={minScale}
          minScale={minScale}
          maxScale={20}
          scrollIntoView={scrollIntoView}
          longitude={center.longitude}
          latitude={center.latitude}
          markers={markers}
          onRegionChange={({ detail, causedBy, type }: any) => {
            if (type === "end" && causedBy === "scale") {
              setScale(detail.scale);
            }
          }}
          onCalloutTap={({ detail: { markerId } }) => {
            console.log(markerId);
            setMarkerId(markerId as number);
          }}
          onTap={() => {
            setMarkerId(undefined);
          }}
        >
          <CoverView slot="callout">
            {markers.map(({ id }) => (
              <CoverView
                markerId={`${id}`}
                key={id}
                className="callout"
                style={{
                  display: markerId === id ? "block" : "none",
                }}
              >
                <CoverImage src={base} className="background" />
                <CoverImage src={img} className="img" />
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
        <MarkerInfo marker={marker} />
      </Flex.Item>
    </Flex>
  );
};

export default Index;
