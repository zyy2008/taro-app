import React, { useState, useEffect, useRef } from "react";
import { MapProps, CoverView, CoverImage } from "@tarojs/components";
import { useModel } from "foca";
import { mapModel, MapState, Line } from "@/store/models/map";
import yuan from "@/assets/marker/yuan.png";
import { Map, MapHandle } from "@/components/index";
import base from "@/assets/marker/base.png";
import img from "@/assets/1.jpg";
import "./mapLine.scss";

type MapLineProps = {
  lineData: Line["polyline"];
  polyline: MapProps.polyline[];
  markerId: number;
};

const minScale: number = 14.5;

const MapLine: React.FC<MapLineProps> = ({
  lineData = [],
  polyline = [],
  markerId,
}) => {
  const mapRef = useRef<MapHandle>();
  const mapState = useModel<MapState>(mapModel);
  const [scale, setScale] = useState<number>(minScale);
  const [markers, setMarkers] = useState<MapProps.marker[]>([]);
  const [center, setCenter] = useState<LocationCenter>({
    longitude: 0,
    latitude: 0,
  });
  useEffect(() => {
    if (mapState?.center) {
      const {
        center: [latitude, longitude],
      } = mapState;
      setScale(minScale);
      setCenter({
        latitude,
        longitude,
      });
    }
  }, [mapState, mapState?.center]);
  useEffect(() => {
    if (mapRef.current?.mapCtx) {
      const [
        {
          location: { lat, lng },
        },
      ] = lineData.filter(({ create_time }) => create_time === markerId);
      mapRef.current?.mapCtx.moveToLocation({
        latitude: lat,
        longitude: lng,
      });
    }
  }, [lineData, markerId, mapRef.current?.mapCtx]);
  useEffect(() => {
    if (lineData.length > 0) {
      setMarkers(
        lineData.map(
          ({ location: { lat, lng }, title, create_time }, index) => {
            const marker: MapProps.marker = {
              id: create_time,
              latitude: lat,
              longitude: lng,
              iconPath: yuan,
              width: 30,
              height: 30,
              callout: {
                content: `${index + 1}`,
                color: "#000000",
                fontSize: 12,
                anchorX: 0,
                anchorY: 25,
                borderRadius: 0,
                borderWidth: 0,
                borderColor: "none",
                bgColor: "none",
                padding: 0,
                display: "ALWAYS",
                textAlign: "center",
              },
              label: {
                fontSize: 12,
                padding: 5,
                content: title,
                color: "#fff",
                bgColor: "#00000070",
                borderRadius: 2,
                textAlign: "center",
                anchorY: 1,
                anchorX: 0,
                x: 0,
                y: 0,
                borderColor: "none",
                borderWidth: 0,
              },
            };
            if (markerId === create_time) {
              return {
                ...marker,
                customCallout: {
                  display: "ALWAYS",
                  anchorY: 25,
                  anchorX: 0,
                },
              };
            }
            return marker;
          }
        )
      );
    }
  }, [lineData, markerId]);
  return (
    <Map
      ref={mapRef}
      scale={scale}
      minScale={minScale}
      maxScale={20}
      longitude={center.longitude}
      latitude={center.latitude}
      markers={markers}
      polyline={polyline}
    >
      <CoverView slot="callout">
        {markers.map(({ id }, index) => (
          <CoverView markerId={`${id}`} key={id}>
            <CoverView className="callout-line">
              <CoverImage src={base} className="background" />
              <CoverImage src={img} className="img" />
            </CoverView>
            <CoverView className="callout-text">{index + 1}</CoverView>
          </CoverView>
        ))}
      </CoverView>
    </Map>
  );
};

export default MapLine;
