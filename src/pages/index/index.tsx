import React, { FC, useCallback } from "react";
import { Flex } from "@taroify/core";
import { Header } from "./components";
import { Map } from "@/components/index";
import { CoverView, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const Index: FC = () => {
  const [scrollIntoView, setScrollIntoView] =
    React.useState<string>("building");
  const useScrollIntoView = useCallback((val) => {
    setScrollIntoView(val);
  }, []);
  return (
    <Flex direction="column" className="home">
      <Flex.Item
        style={{
          width: "100%",
        }}
      >
        <Header
          scrollIntoView={scrollIntoView}
          setScrollIntoView={useScrollIntoView}
        />
      </Flex.Item>
      <Flex.Item
        style={{
          flex: 1,
          width: "100%",
          position: "relative",
        }}
      >
        <Map scrollIntoView={scrollIntoView}>
          <CoverView className="lines">
            <Button
              className="button"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/lines/index",
                });
              }}
            >
              游览线路
            </Button>
          </CoverView>
        </Map>
      </Flex.Item>
    </Flex>
  );
};

export default Index;
