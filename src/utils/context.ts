import React from "react";
import { BackgroundAudioManager } from "@tarojs/taro";

type AudioState = {
  currentTime: number;
  duration: number;
  play: boolean;
  bgCtx: BackgroundAudioManager | undefined;
};

export const AudioContext = React.createContext<AudioState>({
  currentTime: 0,
  duration: 0,
  play: false,
  bgCtx: undefined,
});
