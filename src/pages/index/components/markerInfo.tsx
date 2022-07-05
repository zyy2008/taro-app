import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { View, Text } from "@tarojs/components";
import { Cell } from "@taroify/core";
import "./markerInfo.scss";
import { PlayCircle, PauseCircle } from "@taroify/icons";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import PlayBar from "./playBar";
import { ShareBar } from "@/components/index";
import { AudioContext, QQMapContext } from "@/utils/context";

const src = "https://storage.360buyimg.com/jdrd-blog/27.mp3";

const MarkerInfo: React.FC<{ marker?: LocationInfo | null }> = ({ marker }) => {
  const [visible, setVisible] = useState<boolean>(true);
  const { play, bgCtx, currentTime, duration } = useContext(AudioContext);
  const qqCtx = useContext(QQMapContext);
  const [distance, setDistance] = useState<string>();

  useEffect(() => {
    if (qqCtx && marker) {
      qqCtx.calculateDistance({
        from: "",
        to: `${marker?.location.lat},${marker?.location.lng}`,
        success: ({ result }) => {
          const { elements } = result;
          const [item] = elements;
          const hw = (item.distance / 1000).toFixed(2);
          setDistance(hw);
        },
      });
    }
  }, [qqCtx, marker]);

  const useVisible = useCallback((val: boolean) => {
    setVisible(val);
  }, []);

  const time = useMemo<string>(() => {
    if (bgCtx && currentTime && duration) {
      const time = duration - currentTime;
      return dayjs(time * 1000).format("mm:ss");
    }
    return "00:00";
  }, [bgCtx, currentTime, duration]);

  useEffect(() => {
    if (currentTime && play) {
      setVisible(false);
    }
  }, [currentTime, play]);

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
                  <Text className="distance">距你{distance}公里</Text>
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
