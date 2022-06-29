import React, { useEffect, useState } from "react";
import { Cell, Grid, FixedView, Image, Empty } from "@taroify/core";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { ShareBar } from "@/components/index";
import { useRouter } from "@tarojs/taro";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";

const Detail: React.FC = () => {
  const router = useRouter();
  const mapState = useModel<MapState>(mapModel);
  const [info, setInfo] = useState<LocationInfo>();
  useEffect(() => {
    const { id } = router.params;
    if (Object.keys(mapState).length > 0 && id) {
      const values = Object.values(mapState);
      for (let i = 0; i < values.length; i++) {
        const value = values[i] as LocationInfo[];
        for (let j = 0; j < value.length; j++) {
          const item = value[j];
          if (Number(id) === item.create_time) {
            setInfo(item);
            continue;
          }
        }
      }
    }
  }, [router.params, mapState]);
  return (
    <View className="detail">
      <View className="bar">
        <Image src="https://img.yzcdn.cn/vant/cat.jpeg" className="img" />
        <Cell
          title={
            <View className="title">
              <Text className="name">{info?.title}</Text>
              <Text className="distance">距你25公里</Text>
            </View>
          }
        />
      </View>
      <View className="content">
        {info?.x?.des ? (
          <Text className="text">{info?.x?.des}</Text>
        ) : (
          <Empty>
            <Empty.Image />
            <Empty.Description>暂无数据</Empty.Description>
          </Empty>
        )}
      </View>

      <FixedView
        position="bottom"
        placeholder
        safeArea="bottom"
        className="bottom"
      >
        <ShareBar />
      </FixedView>
    </View>
  );
};

export default Detail;
