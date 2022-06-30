import React, { useEffect, useState, useContext } from "react";
import { Cell } from "@taroify/core";
import { Cross, Play, Pause } from "@taroify/icons";
import { Text } from "@tarojs/components";
import "./playBar.scss";
import { AudioContext } from "@/utils/context";

const PlayBar: React.FC<{
  setVisible?: (T: boolean) => void;
  marker?: LocationInfo | null;
}> = ({ setVisible, marker }) => {
  const { play, bgCtx } = useContext(AudioContext);
  const [title, setTitle] = useState<string>();

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
      {play ? (
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
      <Text className="text">正在播放{title}简介</Text>
    </Cell>
  );
};

export default PlayBar;
