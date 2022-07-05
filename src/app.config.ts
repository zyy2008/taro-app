export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/lines/index",
    "pages/detail/index",
    "pages/routeMap/index",
  ],
  requiredBackgroundModes: ["audio", "location"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序位置接口的效果展示",
    },
  },
});
