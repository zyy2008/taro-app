import React, { useState, useEffect } from "react";
import Taro, { BackgroundAudioManager } from "@tarojs/taro";
import dayjs from "dayjs";
import { Cell, Grid, FixedView, Image, Slider } from "@taroify/core";
import { View } from "@tarojs/components";
import { PlayCircle, PauseCircle } from "@taroify/icons";
import "./index.scss";

const src = "https://storage.360buyimg.com/jdrd-blog/27.mp3";

const Audio: React.FC = () => {
  const [play, setPlay] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>("00:00");
  const [backgroundCtx, setBackgroundCtx] = useState<BackgroundAudioManager>();
  const [value, setValue] = useState<number>(0);
  useEffect(() => {
    const bgCtx = Taro.getBackgroundAudioManager();
    if (typeof bgCtx.paused === "boolean") {
      setPlay(!bgCtx.paused);
    }
    bgCtx.onTimeUpdate(() => {
      if (!bgCtx.paused) {
        setDuration(dayjs(bgCtx.currentTime * 1000).format("mm:ss"));
        setValue((bgCtx.currentTime / bgCtx.duration) * 100);
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
    <Cell
      title={
        <View className="slider">
          <Cell title="语音讲解">{`${duration} / 02:46`}</Cell>
          <Slider size={3} value={value} />
        </View>
      }
      className="audio"
    >
      {play ? (
        <PauseCircle
          size={40}
          onClick={() => {
            backgroundCtx?.pause();
          }}
        />
      ) : (
        <PlayCircle
          size={40}
          onClick={() => {
            if (backgroundCtx) {
              if (backgroundCtx.src === src && backgroundCtx.title === "123") {
                backgroundCtx?.play();
              } else {
                backgroundCtx.src = src;
                backgroundCtx.title = "123";
              }
            }
          }}
        />
      )}
    </Cell>
  );
};

export default Audio;
