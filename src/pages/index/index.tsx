import { FC } from "react";
import { Flex, Button } from "@taroify/core";
import { Map, CoverView } from "@tarojs/components";
import { Header } from "./components";
import { Aim } from "@taroify/icons";
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
        <Map
          style={{
            width: "100%",
            height: "100%",
          }}
          longitude={108.93}
          latitude={34.27}
          showLocation
          scale={15}
          id="myMap"
        />
        <CoverView className="location">
          <Button
            icon={
              <Aim
                style={{
                  margin: 0,
                }}
                size={20}
                onClick={() => {
                  const mapCtx = Taro.createMapContext("myMap");
                  mapCtx.moveToLocation({});
                }}
              />
            }
            shape="round"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </CoverView>
      </Flex.Item>
    </Flex>
  );
};

export default Index;
