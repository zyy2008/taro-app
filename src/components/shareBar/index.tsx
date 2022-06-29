import React from "react";
import { Grid } from "@taroify/core";
import { ShareOutlined, StarOutlined, GuideOutlined } from "@taroify/icons";

const ShareBar: React.FC = () => {
  return (
    <Grid columns={3} direction="horizontal" clickable bordered={false}>
      <Grid.Item icon={<ShareOutlined size={20} />} text="分享" />
      <Grid.Item icon={<StarOutlined size={20} />} text="收藏" />
      <Grid.Item icon={<GuideOutlined size={20} />} text="前往" />
    </Grid>
  );
};

export default ShareBar;
