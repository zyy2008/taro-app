import "@/store";
import { Component } from "react";
import Taro from "@tarojs/taro";
import { FocaProvider, store } from "foca";
import { audioModel } from "@/store/models/audio";
import "./app.scss";

class App extends Component {
  componentDidMount() {
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
    Taro.clearStorage({
      success: () => {
        console.log("123");
      },
    });
    // Taro.createContext()
    // store.refresh(true);
    Taro.addInterceptor(interceptor);
    audioModel.createAudioManager();
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return <FocaProvider>{this.props.children} </FocaProvider>;
  }
}

export default App;
