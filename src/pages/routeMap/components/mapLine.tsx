import React, { useState, useEffect } from "react";
import { MapProps, CoverView } from "@tarojs/components";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";
import yuan from "@/assets/marker/yuan.png";
import { Map } from "@/components/index";

type MapLineProps = {
  lineData: string[];
  polyline: MapProps.polyline[];
};

const minScale: number = 14.5;

const MapLine: React.FC<MapLineProps> = ({ lineData = [], polyline = [] }) => {
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
    if (lineData.length > 0) {
      setMarkers(
        lineData.map((item, index) => {
          const [latitude, longitude] = item.split(",");
          return {
            id: index + 1,
            latitude: Number(latitude),
            longitude: Number(longitude),
            iconPath: yuan,
            width: 30,
            height: 30,
            customCallout: {
              display: "ALWAYS",
              anchorY: 30,
              anchorX: 0,
            },
            label: {
              fontSize: 12,
              padding: 5,
              content: "123",
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
        })
      );
    }
  }, [lineData]);
  return (
    <Map
      scale={scale}
      minScale={minScale}
      maxScale={20}
      longitude={center.longitude}
      latitude={center.latitude}
      markers={markers}
      polyline={polyline}
    >
      <CoverView slot="callout">
        {markers.map(({ id }) => (
          <CoverView markerId={`${id}`} key={id} className="callout">
            {id}
          </CoverView>
        ))}
      </CoverView>
    </Map>
  );
};

export default MapLine;
