import React from "react";
import { Flex, Button, Navbar } from "@taroify/core";
import { Search, AppsOutlined } from "@taroify/icons";
import { ScrollView, View } from "@tarojs/components";
import "./header.scss";

const items: string[] = [
  "景点",
  "卫生间",
  "出入口",
  "服务点",
  "商场",
  "售票处",
  "停车场",
  "派出所",
  "其他",
];

const Header: React.FC = () => {
  const [scrollIntoView, setScrollIntoView] = React.useState<string>("");
  return (
    <Navbar
      className="header"
      title={
        <ScrollView
          style={{
            height: "100%",
            whiteSpace: "nowrap",
          }}
          scrollIntoView={scrollIntoView}
          scrollX
          scrollY={false}
          scrollAnchoring
          scrollWithAnimation
          showScrollbar={false}
          enhanced
          fastDeceleration
          onScroll={({ detail: { scrollLeft } }) => {
            if (Math.floor(scrollLeft) % 30 === 0) {
              console.log(scrollLeft);
            }
          }}
        >
          {items.map((text, index) => {
            const id = `dom${index}`;
            return (
              <View
                id={id}
                className="tab-item"
                key={index}
                onClick={() => {
                  setScrollIntoView(id);
                }}
                style={
                  scrollIntoView === id
                    ? {
                        backgroundColor: "red",
                      }
                    : {}
                }
              >
                {text}
              </View>
            );
          })}
        </ScrollView>
      }
    >
      <Navbar.NavLeft icon={<Search size={20} />} />
      <Navbar.NavRight icon={<AppsOutlined size={20} />} />
    </Navbar>
  );
};

export default Header;
