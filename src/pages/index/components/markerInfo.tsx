import React from "react";
import { View } from "@tarojs/components";
import { Cell, Grid } from "@taroify/core";
import "./markerInfo.scss";
import { PhotoOutlined } from "@taroify/icons";

const MarkerInfo: React.FC = () => {
  return (
    <View className="card">
      <Cell clickable>123</Cell>
      <Grid columns={3} direction="horizontal">
        <Grid.Item icon={<PhotoOutlined />} text="文字" />
        <Grid.Item icon={<PhotoOutlined />} text="文字" />
        <Grid.Item icon={<PhotoOutlined />} text="文字" />
      </Grid>
    </View>
  );
};

export default MarkerInfo;
