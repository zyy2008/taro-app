import React, { useEffect, useState, useCallback } from "react";
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
import Taro, { BackgroundAudioManager } from "@tarojs/taro";
import dayjs from "dayjs";
import PlayBar from "./playBar";

const src = "https://storage.360buyimg.com/jdrd-blog/27.mp3";

const MarkerInfo: React.FC<{ marker?: LocationInfo | null }> = ({ marker }) => {
  const [play, setPlay] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>("02:46");
  const [backgroundCtx, setBackgroundCtx] = useState<BackgroundAudioManager>();
  const [visible, setVisible] = useState<boolean>(true);

  const useVisible = useCallback((val: boolean) => {
    setVisible(val);
  }, []);

  useEffect(() => {
    const bgCtx = Taro.getBackgroundAudioManager();
    if (typeof bgCtx.paused === "boolean") {
      setPlay(!bgCtx.paused);
    }
    bgCtx.onCanplay(() => {
      if (bgCtx.duration && bgCtx.currentTime) {
        const time = bgCtx.duration - bgCtx.currentTime;
        setDuration(dayjs(time * 1000).format("mm:ss"));
      }
    });
    bgCtx.onTimeUpdate(() => {
      if (!bgCtx.paused) {
        const time = bgCtx.duration - bgCtx.currentTime;
        setDuration(dayjs(time * 1000).format("mm:ss"));
      }
    });
    bgCtx.onPlay(() => {
      setPlay(!bgCtx.paused);
    });
    bgCtx.onPause(() => {
      setPlay(!bgCtx.paused);
    });
    bgCtx.onStop(() => {
      setDuration("02:46");
      setPlay(false);
    });
    setBackgroundCtx(bgCtx);
  }, []);

  return (
    <>
      {!visible && (
        <PlayBar play={play} setVisible={useVisible} marker={marker} />
      )}
      {marker && (
        <View className="card">
          <View className="info">
            <Cell
              clickable
              title={
                <View className="info-view">
                  <Text className="title">{marker.title}</Text>
                  <Text className="distance">距你45公里</Text>
                  <Text className="des">{marker.x.des}</Text>
                </View>
              }
              className="text"
            />
            <View className="play">
              {play ? (
                <PauseCircle
                  size={46}
                  onClick={() => {
                    backgroundCtx?.pause();
                  }}
                />
              ) : (
                <PlayCircle
                  size={46}
                  onClick={() => {
                    if (backgroundCtx) {
                      if (
                        backgroundCtx.src === src &&
                        backgroundCtx.title === "123"
                      ) {
                        backgroundCtx?.play();
                      } else {
                        backgroundCtx.src = src;
                        backgroundCtx.title = "123";
                      }
                      setVisible(false);
                    }
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
      )}
    </>
  );
};

export default MarkerInfo;
