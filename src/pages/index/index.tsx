import { FC } from "react";
import { Flex } from "@taroify/core";
import { Map, CoverView, Button, CoverImage } from "@tarojs/components";
import { Header } from "./components";
import { Aim } from "@taroify/icons";
import Taro from "@tarojs/taro";
import "./index.scss";
import img from "./assets/location.png";

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
        >
          <CoverView className="location">
            <Button className="button">
              <CoverImage
                className="img"
                src={img}
                onClick={() => {
                  const mapCtx = Taro.createMapContext("myMap");
                  mapCtx.moveToLocation({});
                }}
              />
            </Button>
          </CoverView>
        </Map>
      </Flex.Item>
    </Flex>
  );
};

export default Index;
