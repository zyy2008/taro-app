import { defineModel } from "foca";
import Taro from "@tarojs/taro";

export type AudioState = {
  currentTime: number;
  duration: number;
  play: boolean;
};

const initialState: AudioState = {
  play: false,
  currentTime: 0,
  duration: 0,
};

export const audioModel = defineModel("audio", {
  initialState,
  actions: {
    setCurrentTime: (state, currentTime: number) => {
      state.currentTime = currentTime;
    },
    setDuration: (state, duration: number) => {
      state.duration = duration;
    },
    setPlay: (state, play: boolean) => {
      state.play = play;
    },
  },
  effects: {
    createAudioManager() {
      const bgCtx = Taro.getBackgroundAudioManager();
      this.setPlay(false);
      bgCtx.onTimeUpdate(() => {
        if (!bgCtx.paused) {
          this.setDuration(bgCtx.duration);
          this.setCurrentTime(bgCtx.currentTime);
        }
      });

      bgCtx.onPlay(() => {
        this.setPlay(!bgCtx.paused);
      });

      bgCtx.onPause(() => {
        this.setPlay(!bgCtx.paused);
      });

      bgCtx.onStop(() => {
        this.setDuration(bgCtx.duration);
        this.setCurrentTime(0);
        this.setPlay(false);
      });
    },
  },
});
