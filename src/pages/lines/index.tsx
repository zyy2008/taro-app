import React, { useState, useContext, useEffect } from "react";
import { Cell, Image, Tag, Space } from "@taroify/core";
import { Text } from "@tarojs/components";
import "./index.scss";
import { useModel } from "foca";
import { mapModel, MapState, Line } from "@/store/models/map";
import { QQMapContext } from "@/utils/context";
import Taro from "@tarojs/taro";
import { formatLine } from "@/utils/index";

const LineItem: React.FC<Line> = ({ title, tag, type, polyline }) => {
  const [time, setTime] = useState<number>();
  const [distance, setDistance] = useState<number>();
  const qqCtx = useContext(QQMapContext);
  useEffect(() => {
    if (qqCtx && polyline.length > 0) {
      formatLine(polyline).then(({ duration, distance }) => {
        setTime(duration);
        setDistance(distance);
      });
    }
  }, [qqCtx, type, polyline]);
  return (
    <Cell
      onClick={() => {
        Taro.navigateTo({
          url: `/pages/routeMap/index?type=${type}`,
        });
      }}
      title={
        <Image
          style={{ width: "70px", height: "70px" }}
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      }
      clickable
      align="center"
    >
      <Text className="title">{title}</Text>
      <Space>
        <Text>{`${polyline?.length ?? 0}个景点`}</Text>
        <Text>{`约${((time ?? 0) / 60).toFixed(1)}个小时`}</Text>
        <Text>{`${((distance ?? 0) / 1000).toFixed(2)}公里`}</Text>
      </Space>
      <Tag>{tag}</Tag>
    </Cell>
  );
};

const Index: React.FC = () => {
  const { lines } = useModel<MapState>(mapModel);
  return (
    <Cell.Group className="lines">
      {lines?.map((item, index) => (
        <LineItem key={index} {...item} />
      ))}
    </Cell.Group>
  );
};

export default Index;
