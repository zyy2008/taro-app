import "@/store";
import { FC, useEffect, useState } from "react";
import Taro, { BackgroundAudioManager } from "@tarojs/taro";
import { FocaProvider } from "foca";
import "./app.scss";
import { AudioContext, QQMapContext, qqMapSdk } from "@/utils/context";

const App: FC = ({ children }) => {
  const [play, setPlay] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [bgCtx, setBgCtx] = useState<BackgroundAudioManager>();

  useEffect(() => {
    const bgCtx = Taro.getBackgroundAudioManager();

    if (typeof bgCtx.paused === "boolean") {
      setPlay(!bgCtx.paused);
    }

    bgCtx.onTimeUpdate(() => {
      if (!bgCtx.paused) {
        setDuration(bgCtx.duration);
        setCurrentTime(bgCtx.currentTime);
      }
    });

    bgCtx.onCanplay(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      bgCtx.duration;
      setTimeout(() => {
        setDuration(bgCtx.duration);
      }, 0);
    });

    bgCtx.onPlay(() => {
      setPlay(!bgCtx.paused);
    });

    bgCtx.onPause(() => {
      setPlay(!bgCtx.paused);
    });

    bgCtx.onStop(() => {
      setDuration(bgCtx.duration);
      setPlay(false);
    });

    setBgCtx(bgCtx);
  }, []);

  useEffect(() => {
    const interceptor = (chain) => {
      const requestParams = chain.requestParams;
      const { data, url } = requestParams;
      return chain
        .proceed({
          ...requestParams,
          url: `${process.env.MAP_API}${url}`,
          data: {
            ...data,
            table_id: "0oH1LLNWTdONunVRf1",
            key: process.env.KEY,
          },
        })
        .then((res) => {
          return res;
        });
    };
    Taro.addInterceptor(interceptor);
  }, []);
  return (
    <FocaProvider>
      <QQMapContext.Provider value={qqMapSdk}>
        <AudioContext.Provider value={{ play, duration, currentTime, bgCtx }}>
          {children}
        </AudioContext.Provider>
      </QQMapContext.Provider>
    </FocaProvider>
  );
};

export default App;
