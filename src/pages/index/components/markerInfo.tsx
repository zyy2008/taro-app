import React, { useEffect, useState, useCallback } from "react";
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
  const [play, setPlay] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>("02:46");
  const [backgroundCtx, setBackgroundCtx] = useState<BackgroundAudioManager>();
  const [visible, setVisible] = useState<boolean>(true);
  const mapState = useModel<AudioState>(audioModel);

  const useVisible = useCallback((val: boolean) => {
    setVisible(val);
  }, []);

  useEffect(() => {
    const bgCtx = Taro.getBackgroundAudioManager();
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
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/detail/index?id=${marker.create_time}`,
                });
              }}
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

          <ShareBar />
        </View>
      )}
    </>
  );
};

export default MarkerInfo;
