import "@/store";
import { Component } from "react";
import Taro from "@tarojs/taro";
import { FocaProvider } from "foca";
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
    Taro.addInterceptor(interceptor);
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