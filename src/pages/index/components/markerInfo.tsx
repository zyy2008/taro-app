import React, { useEffect, useState, useMemo } from "react";
import { View, Text } from "@tarojs/components";
import { Cell, Grid } from "@taroify/core";
import "./markerInfo.scss";
import {
  ShareOutlined,
  StarOutlined,
  GuideOutlined,
  PlayCircle,
  PauseCircle,
} from "@taroify/icons";
import Taro, { InnerAudioContext, BackgroundAudioManager } from "@tarojs/taro";
import dayjs from "dayjs";

const MarkerInfo: React.FC = () => {
  const [audioCtx, setAudioCtx] = useState<InnerAudioContext>();
  const [play, setPlay] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>();
  const [backgroundCtx, setBackgroundCtx] = useState<BackgroundAudioManager>();

  useEffect(() => {
    const src = "https://storage.360buyimg.com/jdrd-blog/27.mp3";
    const ctx = Taro.createInnerAudioContext();
    const bgCtx = Taro.getBackgroundAudioManager();
    ctx.autoplay = false;
    ctx.src = src;
    bgCtx.src = src;
    bgCtx.title = "此时此刻";
    bgCtx.epname = "此时此刻";
    bgCtx.singer = "许巍";
    bgCtx.coverImgUrl =
      "https://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000";
    setAudioCtx(ctx);
    setBackgroundCtx(bgCtx);
    return () => {
      if (ctx) {
        ctx.destroy();
      }
    };
  }, []);
  useEffect(() => {
    if (audioCtx) {
      audioCtx.onCanplay(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        audioCtx.duration;
        // 必须。不然也获取不到时长
        setTimeout(() => {
          const time = dayjs(audioCtx.duration * 1000).format("mm:ss");
          setDuration(time);
        }, 0);
      });
      audioCtx.onTimeUpdate(() => {
        const time = audioCtx.duration - audioCtx.currentTime;
        setDuration(dayjs(time * 1000).format("mm:ss"));
      });
      audioCtx.onPlay(() => {
        setPlay(!audioCtx.paused);
      });
      audioCtx.onPause(() => {
        setPlay(!audioCtx.paused);
      });
      audioCtx.onStop(() => {
        const time = dayjs(audioCtx.duration * 1000).format("mm:ss");
        setDuration(time);
      });
    }
    return () => {
      if (audioCtx) {
        audioCtx.offCanplay();
        audioCtx.offTimeUpdate();
        audioCtx.offPlay();
        audioCtx.offPause();
      }
    };
  }, [audioCtx]);

  return (
    <View className="card">
      <View className="info">
        <Cell
          clickable
          title={
            <View className="info-view">
              <Text className="title">一号坑</Text>
              <Text className="distance">距你45公里</Text>
              <Text className="des">一号兵马俑坑是1974一</Text>
            </View>
          }
          className="text"
        />
        <View className="play">
          {play ? (
            <PauseCircle
              size={46}
              onClick={() => {
                audioCtx?.pause();
              }}
            />
          ) : (
            <PlayCircle
              size={46}
              onClick={() => {
                audioCtx?.play();
                backgroundCtx?.play();
              }}
            />
          )}

          <Text className="time">{duration}</Text>
        </View>
      </View>

      <Grid columns={3} direction="horizontal" clickable bordered={false}>
        <Grid.Item icon={<ShareOutlined size={20} />} text="分享" />
        <Grid.Item icon={<StarOutlined size={20} />} text="收藏" />
        <Grid.Item icon={<GuideOutlined size={20} />} text="前往" />
      </Grid>
    </View>
  );
};

export default MarkerInfo;
