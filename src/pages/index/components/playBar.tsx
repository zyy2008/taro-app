import React, { useEffect, useState } from "react";
import { Cell } from "@taroify/core";
import { Cross, Play, Pause } from "@taroify/icons";
import { Text } from "@tarojs/components";
import Taro, { BackgroundAudioManager } from "@tarojs/taro";
import "./playBar.scss";

const PlayBar: React.FC<{
  play?: boolean;
  setVisible?: (T: boolean) => void;
}> = ({ play, setVisible }) => {
  const [backgroundCtx, setBackgroundCtx] = useState<BackgroundAudioManager>();

  useEffect(() => {
    const bgCtx = Taro.getBackgroundAudioManager();
    setBackgroundCtx(bgCtx);
  }, []);
  return (
    <Cell
      className="bar"
      rightIcon={
        <Cross
          onClick={() => {
            setVisible?.(true);
            backgroundCtx?.stop();
          }}
        />
      }
    >
      {play ? (
        <Pause
          size={20}
          onClick={() => {
            backgroundCtx?.pause();
          }}
        />
      ) : (
        <Play
          size={20}
          onClick={() => {
            backgroundCtx?.play();
          }}
        />
      )}
      <Text className="text">正在播放一号坑简介</Text>
    </Cell>
  );
};

export default PlayBar;
