import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { Flex, Button } from "@taroify/core";
import { Header, MarkerInfo } from "./components";
import { Map, MapHandle } from "@/components/index";
import {
  MapProps,
  Text,
  CoverView,
  CoverImage,
  BaseEventOrig,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";
import { markersFilter, markersFormat } from "@/utils/marker";
import "./index.scss";
import base from "@/assets/marker/base.png";
import img from "@/assets/1.jpg";

const minScale: number = 14.5;

const Index: React.FC = () => {
  const mapRef = useRef<MapHandle>(null);
  const [scale, setScale] = useState<number>(minScale);
  const [scrollIntoView, setScrollIntoView] = useState<string>("building");
  const [marker, setMarker] = useState<LocationInfo>();
  const [center, setCenter] = useState<LocationCenter>({
    longitude: 0,
    latitude: 0,
  });
  const mapState = useModel<MapState>(mapModel);
  const useScrollIntoView = useCallback((val) => {
    setScrollIntoView(val);
  }, []);

  const markers = useMemo<MapProps.marker[]>(() => {
    const values = mapState?.[scrollIntoView] as LocationInfo[];
    const filters = markersFilter(values, { scale, minScale });
    return markersFormat(filters, marker?.create_time ?? 0);
  }, [mapState, scrollIntoView, scale, marker]);

  useEffect(() => {
    if (mapRef.current && mapState?.center && scrollIntoView) {
      const {
        center: [latitude, longitude],
      } = mapState;
      setScale(minScale);
      setCenter({
        latitude,
        longitude,
      });
    }
  }, [scrollIntoView, mapState, mapRef]);

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
          scale={scale}
          minScale={minScale}
          maxScale={20}
          longitude={center.longitude}
          latitude={center.latitude}
          markers={markers}
          onRegionChange={({ detail, causedBy, type }: any) => {
            if (type === "end") {
              if (causedBy === "drag" || causedBy === "scale") {
                setScale(detail.scale);
                setCenter(detail.centerLocation);
              }
            }
          }}
          onMarkerTap={(
            res: BaseEventOrig<MapProps.onMarkerTapEventDetail>
          ) => {
            const {
              detail: { markerId },
            } = res;
            const values = mapState?.[scrollIntoView] as LocationInfo[];
            const [item] =
              values?.filter(({ create_time }) => create_time === markerId) ??
              [];
            const { lat, lng } = item.location;
            setMarker(item);
            setCenter({
              latitude: lat,
              longitude: lng,
            });
          }}
          onTap={() => {
            setMarker(undefined);
          }}
        >
          <CoverView slot="callout">
            {markers.map(({ id }) => (
              <CoverView markerId={`${id}`} key={id} className="callout">
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
