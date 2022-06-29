import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text } from "@tarojs/components";
import { Cell } from "@taroify/core";
import "./markerInfo.scss";
import { PlayCircle, PauseCircle } from "@taroify/icons";
import Taro, { BackgroundAudioManager } from "@tarojs/taro";
import dayjs from "dayjs";
import PlayBar from "./playBar";
import { ShareBar } from "@/components/index";
import { useModel } from "foca";
import { audioModel, AudioState } from "@/store/models/audio";

const src = "https://storage.360buyimg.com/jdrd-blog/27.mp3";

const MarkerInfo: React.FC<{ marker?: LocationInfo | null }> = ({ marker }) => {
  const [bgCtx, setBgCtx] = useState<BackgroundAudioManager>();
  const [visible, setVisible] = useState<boolean>(true);
  const mapState = useModel<AudioState>(audioModel);

  const useVisible = useCallback((val: boolean) => {
    setVisible(val);
  }, []);

  useEffect(() => {
    const bgCtx = Taro.getBackgroundAudioManager();
    setBgCtx(bgCtx);
  }, []);

  const time = useMemo<string>(() => {
    if (bgCtx && mapState.currentTime) {
      const time = bgCtx.duration - mapState.currentTime;
      return dayjs(time * 1000).format("mm:ss");
    }
    return "00:00";
  }, [mapState.currentTime, bgCtx]);

  return (
    <>
      {!visible && <PlayBar setVisible={useVisible} marker={marker} />}
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
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/detail/index?id=${marker.create_time}`,
                });
              }}
            />
            <View className="play">
              {mapState.play ? (
                <PauseCircle
                  size={46}
                  onClick={() => {
                    bgCtx?.pause();
                  }}
                />
              ) : (
                <PlayCircle
                  size={46}
                  onClick={() => {
                    if (bgCtx) {
                      if (bgCtx.src === src && bgCtx.title === "123") {
                        bgCtx?.play();
                      } else {
                        bgCtx.src = src;
                        bgCtx.title = "123";
                        bgCtx.epname = "1233333";
                      }
                      setVisible(false);
                    }
                  }}
                />
              )}

              <Text className="time">{time}</Text>
            </View>
          </View>

          <ShareBar />
        </View>
      )}
    </>
  );
};

export default MarkerInfo;
