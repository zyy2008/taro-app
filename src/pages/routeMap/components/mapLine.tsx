import React, { useState, useEffect } from "react";
import { MapProps, CoverView } from "@tarojs/components";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";
import yuan from "@/assets/marker/yuan.png";
import { Map } from "@/components/index";
import { formatLine } from "@/utils/index";

type MapLineProps = {
  type: string;
};

const minScale: number = 14.5;

const MapLine: React.FC<MapLineProps> = ({ type }) => {
  const mapState = useModel<MapState>(mapModel);
  const [scale, setScale] = useState<number>(minScale);
  const [markers, setMarkers] = useState<MapProps.marker[]>([]);
  const [polyline, setPolyline] = useState<MapProps.polyline[]>([]);
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
    const { lines } = mapState;
    if (type && type != "0" && (lines?.length ?? 0) > 0) {
      const [{ polyline }] = lines?.filter((item) => item.type === type);
      setMarkers(
        polyline.map((item, index) => {
          const [latitude, longitude] = item.split(",");
          return {
            id: index,
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
      formatLine(polyline).then(({ polyline: line }) => {
        setPolyline(line);
      });
    }
  }, [type, mapState.lines, mapState]);
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
