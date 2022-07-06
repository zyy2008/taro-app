import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import { useRouter } from "@tarojs/taro";
import { Swiper } from "@taroify/core";
import { MapLine } from "./components";
import { useModel } from "foca";
import { mapModel, MapState, Line } from "@/store/models/map";
import { formatLine, FormatLine } from "@/utils/index";

type Params = {
  type: string;
};

const SwiperItem: React.FC<Line> = ({ type, title }) => {
  const { lines } = useModel<MapState>(mapModel);
  const [lineInfo, setLineInfo] = useState<Omit<FormatLine, "polyline">>({
    distance: 0,
    duration: 0,
  });
  useEffect(() => {
    if (type && (lines?.length ?? 0) > 0) {
      const [{ polyline }] = lines.filter((item) => item.type === type);
      formatLine(polyline).then((res) => {
        setLineInfo(res);
      });
    }
  }, [type, lines]);
  return (
    <Swiper.Item __dataIndex__={Number(type)}>
      <View className="item">
        <View className="card">{title}</View>
      </View>
    </Swiper.Item>
  );
};

const RouteMap: React.FC = () => {
  const { params } = useRouter<Params>();
  const [value, setValue] = useState<number>(0);
  const { lines } = useModel<MapState>(mapModel);
  useEffect(() => {
    setValue(Number(params.type));
  }, [params.type]);

  return (
    <View className="route">
      <MapLine type={String(value)} />
      <Swiper className="swiper" loop={false} value={value} onChange={setValue}>
        <Swiper.Indicator />
        {lines.map((item) => (
          <SwiperItem {...item} key={item.type} />
        ))}
      </Swiper>
    </View>
  );
};

export default RouteMap;
