import React, { useEffect, useState } from "react";
import { Cell } from "@taroify/core";
import { Cross, Play, Pause } from "@taroify/icons";
import { Text } from "@tarojs/components";
import Taro, { BackgroundAudioManager } from "@tarojs/taro";
import "./playBar.scss";
import { useModel } from "foca";
import { audioModel, AudioState } from "@/store/models/audio";

const PlayBar: React.FC<{
  setVisible?: (T: boolean) => void;
  marker?: LocationInfo | null;
}> = ({ setVisible, marker }) => {
  const [bgCtx, setBgCtx] = useState<BackgroundAudioManager>();
  const mapState = useModel<AudioState>(audioModel);
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    const bgCtx = Taro.getBackgroundAudioManager();
    setBgCtx(bgCtx);
  }, []);

  useEffect(() => {
    if (marker) {
      setTitle(marker.title);
    }
  }, [marker]);

  return (
    <Cell
      className="bar"
      rightIcon={
        <Cross
          onClick={() => {
            setVisible?.(true);
            bgCtx?.stop();
          }}
        />
      }
    >
      {mapState.play ? (
        <Pause
          size={20}
          onClick={() => {
            bgCtx?.pause();
          }}
        />
      ) : (
        <Play
          size={20}
          onClick={() => {
            bgCtx?.play();
          }}
        />
      )}
      <Text className="text">正在播放{bgCtx?.epname}简介</Text>
    </Cell>
  );
};

export default PlayBar;
