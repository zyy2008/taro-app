import React from "react";
import { BackgroundAudioManager } from "@tarojs/taro";
import QQMapWX from "@/labs/qqmap-wx-jssdk.min.js";

export const qqMapSdk = new QQMapWX({
  key: process.env.KEY, // 必填
});

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

export const QQMapContext = React.createContext<any>(undefined);
