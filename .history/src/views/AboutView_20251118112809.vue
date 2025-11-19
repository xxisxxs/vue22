<template>
  <div id="map" style="width: 100%; height: 100%"></div>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
  },
  mounted() {
    var map;

    // 申请的key和sn
    SGMap.tokenTask
      .login("9874acd812563f61a7fab126a6db9023", "a118728ce08f3baf971f1d682986cc08") //外网
      .then(function () {
        initMap();
      });

    function initMap() {
      map = new SGMap.Map({
       // 地图绑定的DOM元素ID
        container: "map",
        // 地图样式
        style: "aegis://styles/aegis/Satellite512",
        // 默认缩放层级
        zoom: 10,
        // 地图中心点
        center: [114.30137859, 30.44427428],
        // 地图默认字体
        localIdeographFontFamily: "Microsoft YaHei Regular",
      });
      // 监听地图加载完成事件
      // 地图事件请参考文档 https://map.sgcc.com.cn/products/js-sdk/v3/doc.html#Events
      map.on("load", function (e) {
        // log.success("地图加载完成");
      });
    }
  }
}
</script>
