import React from "react";
import { Flex, Button, Navbar } from "@taroify/core";
import { Search, AppsOutlined } from "@taroify/icons";
import { ScrollView, View } from "@tarojs/components";
import "./header.scss";

const items: { label: string; value: string }[] = [
  {
    label: "建筑物",
    value: "building",
  },
  {
    label: "卫生间",
    value: "ashcan",
  },
  {
    label: "服务点",
    value: "service",
  },
];

const Header: React.FC<{
  scrollIntoView: string;
  setScrollIntoView: (T: string) => void;
}> = ({ scrollIntoView, setScrollIntoView }) => {
  return (
    <Navbar
      className="header"
      title={
        <ScrollView
          style={{
            height: "100%",
            whiteSpace: "nowrap",
            textAlign: "left",
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
          {items.map(({ label, value }) => {
            return (
              <View
                id={value}
                className="tab-item"
                key={value}
                onClick={() => {
                  setScrollIntoView(value);
                }}
                style={
                  scrollIntoView === value
                    ? {
                        backgroundColor: "red",
                      }
                    : {}
                }
              >
                {label}
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
