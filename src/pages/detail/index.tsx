import React, { useEffect, useState, useContext } from "react";
import { Cell, FixedView, Image, Empty } from "@taroify/core";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { ShareBar, Audio } from "@/components/index";
import { useRouter } from "@tarojs/taro";
import { useModel } from "foca";
import { mapModel, MapState } from "@/store/models/map";
import { QQMapContext } from "@/utils/context";

const Detail: React.FC = () => {
  const router = useRouter();
  const mapState = useModel<MapState>(mapModel);
  const [info, setInfo] = useState<LocationInfo>();
  const qqCtx = useContext(QQMapContext);
  const [distance, setDistance] = useState<string>();

  useEffect(() => {
    if (qqCtx && info) {
      qqCtx.calculateDistance({
        from: "",
        to: `${info?.location.lat},${info?.location.lng}`,
        success: ({ result }) => {
          const { elements } = result;
          const [item] = elements;
          const hw = (item.distance / 1000).toFixed(2);
          setDistance(hw);
        },
      });
    }
  }, [qqCtx, info]);

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
              <Text className="distance">距你{distance}公里</Text>
            </View>
          }
        />
      </View>
      <View className="content">
        <Audio
          style={{
            marginBottom: "40rpx",
            marginTop: "20rpx",
          }}
        />
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
