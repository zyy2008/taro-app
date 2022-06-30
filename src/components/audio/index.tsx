import React, { useState, useContext, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { Cell, Slider } from "@taroify/core";
import { View } from "@tarojs/components";
import { PlayCircle, PauseCircle } from "@taroify/icons";
import "./index.scss";
import { AudioContext } from "@/utils/context";

const src = "https://storage.360buyimg.com/jdrd-blog/27.mp3";

const Audio: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const { play, bgCtx, currentTime, duration } = useContext(AudioContext);

  useEffect(() => {
    setValue((currentTime / duration) * 100);
  }, [currentTime, duration]);

  const time = useMemo<string>(() => {
    return dayjs(currentTime * 1000).format("mm:ss");
  }, [currentTime]);

  return (
    <Cell
      title={
        <View className="slider">
          <Cell title="语音讲解">{`${time} / 02:46`}</Cell>
          <Slider size={3} value={value} />
        </View>
      }
      className="audio"
    >
      {play ? (
        <PauseCircle
          size={40}
          onClick={() => {
            bgCtx?.pause();
          }}
        />
      ) : (
        <PlayCircle
          size={40}
          onClick={() => {
            if (bgCtx) {
              if (bgCtx.src === src && bgCtx.title === "123") {
                bgCtx?.play();
              } else {
                bgCtx.src = src;
                bgCtx.title = "123";
              }
            }
          }}
        />
      )}
    </Cell>
  );
};

export default Audio;
