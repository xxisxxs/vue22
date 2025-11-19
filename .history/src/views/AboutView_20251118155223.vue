<template>
  <div id="map" style="width: 100%; height: 100%"></div>

</template>

<script>
import TD from "./td.js"
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      channelData: TD,
      channelMultiData: {
        type: 'FeatureCollection',
        features: []
      },
      channelFacilityData:{
        type: 'FeatureCollection',
        features: []
      },
    }
  },
  mounted() {
    console.log("fffffffffff",TD)
    // 1. 动态加载思极 JS SDK
    this.loadScript("https://map.sgcc.com.cn/maps?v=3.0.0").then(() => {
      // 2. 等 SDK 加载完后，执行登录
      SGMap.tokenTask
        .login("9874acd812563f61a7fab126a6db9023", "a118728ce08f3baf971f1d682986cc08") //外网
        .then(() => {
          this.initMap();
        });
    });
    
  },
  methods: {
     // 动态加载 script
    loadScript(src) {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    },
    initMap() {
      this.map = new SGMap.Map({
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
      this.map.on("load", () => {
        this.addLineLayer();
      });
    },
    addLineLayer() {
      this.map.addSource('power-lines', {
        type: 'geojson',
        data: this.channelData
      });

      // 2. 添加线的图层
      this.map.addLayer({
        id: 'power-lines-layer',
        type: 'line',
        source: 'power-lines',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': [
            'match',
            ['get', 'type'],
            '35kv', 'red',
            '110kv', 'blue',
            '220kv', 'green',
            'diangouxian', 'yellow',
            'suidao', 'pink',
            'red'
          ],
          'line-width': 3
        }
      });
    },
  },
}
</script>
