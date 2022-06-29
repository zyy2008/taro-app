import { Middleware, store } from "foca";
import { taroStorage } from "foca-taro-storage";
import { createLogger } from "redux-logger";
import { mapModel } from "./models/map";
import { audioModel } from "./models/audio";

const middleware: Middleware[] = [];

if (process.env.NODE_ENV !== "production") {
  middleware.push(
    createLogger({
      collapsed: true,
      diff: true,
      duration: true,
      logErrors: true,
    })
  );
}

store.init({
  compose: "redux-devtools",
  middleware,
  persist: [
    {
      version: "1",
      key: `foca-taro-demo-${process.env.NODE_ENV}`,
      engine: taroStorage,
      models: [mapModel, audioModel],
    },
  ],
});

if (module.hot) {
  module.hot.accept();
}
