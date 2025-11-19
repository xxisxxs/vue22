<template>
  <div id="map" style="width: 100%; height: 100%"></div>

</template>

<script>
import TD from "./td.js";
import TDD from "./tdd.js";
import TDSB from "./tdsb.js";
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      channelData: TD,
      channelMultiData: TDD,
      channelFacilityData:TDSB,
      image: ''
    }
  },
  mounted() {
    // console.log("fffffffffff",TD)
    // this.channelData.features
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
        zoom: 12,
        // 地图中心点
        center: [114.30137859, 30.44427428],
        // 地图默认字体
        localIdeographFontFamily: "Microsoft YaHei Regular",
      });
      // 监听地图加载完成事件
      // 地图事件请参考文档 https://map.sgcc.com.cn/products/js-sdk/v3/doc.html#Events
      this.map.on("load", () => {
        this.addChannelSegment();
        // this.addChannelEquipment();
      });
    },
    addChannelEquipment() {
      const map = this.map;

      // 1. 定义 fslx 与图片的对应关系
      // const imageMap = {
      //   转弯井: require("@/assets/img/A1.png"),
      //   直通井: require("@/assets/img/A2.png"),
      //   转角井: require("@/assets/img/A3.png"),
      //   接头井: require("@/assets/img/A1.png"),
      //   三通井: require("@/assets/img/A2.png"),
      //   四通井: require("@/assets/img/A3.png"),
      //   余缆井: require("@/assets/img/A2.png"),
      //   直线井: require("@/assets/img/A3.png")
      // };

      // 2. 根据 fslx 对数据进行分组（每种图片一个图层）
      const grouped = {};
      this.channelFacilityData.features.forEach((f) => {
        const key = f.properties.fslx;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(f);
      });

      // 3. 为每种 fslx 加载图片 → 添加图层
      Object.keys(grouped).forEach((fslx) => {
        const imgUrl = imageMap[fslx];

        // 加载图片
        map.loadImage(imgUrl, (err, image) => {
          if (err) {
            console.error("图片加载失败:", imgUrl);
            return;
          }

          // 注册图片
          const imageId = `icon-${fslx}`;
          if (!map.hasImage(imageId)) {
            map.addImage(imageId, image);
          }

          // 添加数据源
          const sourceId = `source-${fslx}`;
          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: grouped[fslx]
            }
          });

          // 添加图层
          map.addLayer({
            id: `layer-${fslx}`,
            type: "symbol",
            source: sourceId,
            layout: {
              "icon-image": imageId,
              "icon-size": 0.8,
              "icon-allow-overlap": true
            }
          });
        });
      });
    },
    addChannelEquipment() {
      this.map.addSource('channel-points', {
        type: 'geojson',
        data: this.channelFacilityData
      });
      map.addImage("poi", this.image);
      this.map.addLayer({
        id: 'channel-points-layer',
        type: 'symbol',
        source: 'channel-points',
        layout: {
          "icon-image": "poi",
          "icon-size": 1,
          "text-field": "{name}",
          "text-size": 12,
          "text-anchor": "top",
          "icon-anchor": "bottom",
          "text-offset": [0, 0],
          "text-max-width": 8,
          "text-font": ["Microsoft YaHei Regular"],
        },
        paint: {
          "text-color": "#ff0000",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1.33333,
        }
      });
    },
    addChannelSegment() {
      this.map.addSource('channel-lines', {
        type: 'geojson',
        data: this.channelMultiData
      });

      // 2. 添加线的图层
      this.map.addLayer({
        id: 'channel-lines-layer',
        type: 'line',
        source: 'channel-lines',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': [
            'match',
            ['get', 'fslx'],
            '106', '#FFD700',
            '105', '#FF00FF',
            '107', '#DC143C',
            '109', '#008000',
            '108', '#FFA500',
            '104','#1E90FF',
            '#fff'
          ],
          'line-width': 10
        }
      });
    },
  },
}
</script>
