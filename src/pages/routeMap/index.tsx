import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { useRouter } from "@tarojs/taro";
import { Swiper, Cell, Space, Button } from "@taroify/core";
import { MapLine } from "./components";
import { useModel } from "foca";
import { mapModel, MapState, Line } from "@/store/models/map";
import { formatLine, FormatLine } from "@/utils/index";

type Params = {
  type: string;
};

type Polyline = Pick<FormatLine, "polyline"> & {
  lineData: string[];
  type: string;
};

const SwiperItem: React.FC<Line & { setPolyline?: (T: Polyline) => void }> = ({
  type,
  title,
  setPolyline,
}) => {
  const { lines } = useModel<MapState>(mapModel);
  const [lineInfo, setLineInfo] = useState<Omit<FormatLine, "polyline">>({
    distance: 0,
    duration: 0,
  });

  const polyline = useMemo<string[]>(() => {
    if (type && (lines?.length ?? 0) > 0) {
      const [{ polyline }] = lines.filter((item) => item.type === type);
      return polyline;
    }
    return [];
  }, [type, lines]);

  useEffect(() => {
    if ((polyline.length ?? 0) > 0) {
      formatLine(polyline).then(({ polyline: line, ...others }) => {
        setPolyline?.({
          type,
          lineData: polyline,
          polyline: line,
        });
        setLineInfo(others);
      });
    }
  }, [polyline, setPolyline, type]);

  return (
    <Swiper.Item __dataIndex__={Number(type)}>
      <View className="item">
        <Cell
          className="cell"
          title={
            <View className="info">
              <Text className="title">{title}</Text>
              <Space>
                <Text>{`${polyline?.length ?? 0}个景点`}</Text>
                <Text>{`约${((lineInfo.duration ?? 0) / 60).toFixed(
                  1
                )}个小时`}</Text>
                <Text>{`${((lineInfo.distance ?? 0) / 1000).toFixed(
                  2
                )}公里`}</Text>
              </Space>
            </View>
          }
          align="center"
        >
          <Button color="primary" className="button">
            开始游览
          </Button>
        </Cell>
      </View>
    </Swiper.Item>
  );
};

const RouteMap: React.FC = () => {
  const { params } = useRouter<Params>();
  const [value, setValue] = useState<number>(0);
  const { lines } = useModel<MapState>(mapModel);
  const [polyline, setPolyline] = useState<Polyline[]>([]);

  const usePolyline = useCallback((value: Polyline) => {
    setPolyline((val) => {
      return [value, ...val];
    });
  }, []);

  useEffect(() => {
    setValue(Number(params.type) - 1);
  }, [params.type]);

  const lineItem = useMemo<Polyline>(() => {
    const [item] = polyline.filter(({ type }) => type === String(value + 1));
    return item;
  }, [value, polyline]);

  return (
    <View className="route">
      <MapLine lineData={lineItem?.lineData} polyline={lineItem?.polyline} />
      <Swiper className="swiper" loop={false} value={value} onChange={setValue}>
        <Swiper.Indicator />
        {lines.map((item) => (
          <SwiperItem {...item} key={item.type} setPolyline={usePolyline} />
        ))}
      </Swiper>
    </View>
  );
};

export default RouteMap;
