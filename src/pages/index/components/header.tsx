import React from "react";
import { Flex, Button } from "@taroify/core";
import { Search, AppsOutlined } from "@taroify/icons";
import { ScrollView, View } from "@tarojs/components";

const Header: React.FC = () => {
  return (
    <Flex>
      <Flex.Item>
        <Button size="small" variant="text" icon={<Search size={20} />} />
      </Flex.Item>
      <Flex.Item
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          style={{
            height: "30px",
            whiteSpace: "nowrap",
            display: "grid",
          }}
          scrollX
          scrollY={false}
          scrollAnchoring
          scrollWithAnimation
          showScrollbar={false}
          enhanced
        >
          {Array(30)
            .fill(0)
            .map((_, index) => (
              <View
                id={`dom${index}`}
                key={index}
                style={{
                  width: 60,
                  height: 30,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: "red",
                  display: "inline-block",
                }}
              >
                {index}
              </View>
            ))}
        </ScrollView>
      </Flex.Item>
      <Flex.Item>
        <Button size="small" variant="text" icon={<AppsOutlined size={20} />} />
      </Flex.Item>
    </Flex>
  );
};

export default Header;
