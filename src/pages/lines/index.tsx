import React from "react";
import { Cell, Image, Tag, Space } from "@taroify/core";
import { View, Text } from "@tarojs/components";
import "./index.scss";

type LineInfo = {
  place?: number;
  time?: number;
  distance?: number;
};

type line = {
  title?: string;
  info?: LineInfo;
  type?: string;
};

const lines: line[] = [
  {
    title: "夏日纳凉路线",
    info: {
      place: 5,
      time: 3.5,
      distance: 20,
    },
    type: "夏日纳凉",
  },
];

const Index: React.FC = () => {
  return (
    <Cell.Group className="lines">
      {lines?.map((item, index) => (
        <Cell
          title={
            <Image
              style={{ width: "70px", height: "70px" }}
              src="https://img.yzcdn.cn/vant/cat.jpeg"
            />
          }
          clickable
          key={index}
          align="center"
        >
          <Text className="title">{item.title}</Text>
          <Space>
            <Text>{`${item.info?.place}个景点`}</Text>
            <Text>{`约${item.info?.time}个小时`}</Text>
            <Text>{`${item.info?.distance}公里`}</Text>
          </Space>
          <Tag>{item.type}</Tag>
        </Cell>
      ))}
    </Cell.Group>
  );
};

export default Index;
