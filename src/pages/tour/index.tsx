import React, { useMemo, useState, useEffect } from "react";
import { View, MapProps } from "@tarojs/components";
import { MapLine } from "./components";
import { useRouter } from "@tarojs/taro";
import { useModel } from "foca";
import { mapModel, MapState, Line } from "@/store/models/map";
import { formatLine } from "@/utils/index";
import { Swiper, Tag } from "@taroify/core";
import { MarkerCard } from "@/components/index";
import "./index.scss";

type Params = {
  type: string;
};

const SwiperItem: React.FC<LocationInfo & { index: number }> = ({
  index,
  ...others
}) => {
  return (
    <Swiper.Item>
      <View className="item">
        <MarkerCard
          icon={
            <Tag color="info" className="tag-info">
              {index + 1}
            </Tag>
          }
          lineClamp={1}
          marker={others}
          style={{
            position: "inherit",
          }}
        />
      </View>
    </Swiper.Item>
  );
};

const Tour: React.FC = () => {
  const { params } = useRouter<Params>();
  const { lines } = useModel<MapState>(mapModel);
  const [value, setValue] = useState<number>(0);
  const [polyline, setPolyline] = useState<MapProps.polyline[]>([]);
  const lineData = useMemo<Line["polyline"]>(() => {
    if (params.type && (lines?.length ?? 0) > 0) {
      const [{ polyline }] = lines.filter((item) => item.type === params.type);
      return polyline;
    }
    return [];
  }, [params.type, lines]);

  useEffect(() => {
    formatLine(lineData).then(({ polyline }) => {
      setPolyline(polyline);
    });
  }, [lineData]);

  const markerId = useMemo<number>(() => {
    const { create_time } = lineData[value];
    return create_time;
  }, [lineData, value]);

  return (
    <View className="route">
      <MapLine lineData={lineData} polyline={polyline} markerId={markerId} />
      <Swiper className="swiper" loop={false} value={value} onChange={setValue}>
        <Swiper.Indicator />
        {lineData.map((item, index) => (
          <SwiperItem key={item.create_time} {...item} index={index} />
        ))}
      </Swiper>
    </View>
  );
};

export default Tour;
