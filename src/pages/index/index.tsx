import { FC } from "react";
import { Flex } from "@taroify/core";
import { Header } from "./components";
import { Map } from "@/components/index";
import { CoverView, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const Index: FC = () => {
  return (
    <Flex direction="column" className="home">
      <Flex.Item
        style={{
          width: "100%",
        }}
      >
        <Header />
      </Flex.Item>
      <Flex.Item
        style={{
          flex: 1,
          width: "100%",
          position: "relative",
        }}
      >
        <Map>
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
