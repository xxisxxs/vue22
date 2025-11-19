<template>
  <div id="map" style="width: 100%; height: 100%"></div>

</template>

<script>
import TD from "./td.json"
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      channelData: {
        type: 'FeatureCollection',
        features: [{
                "type": "Feature",
                "id": "GIS_XL.fid--6ca34cff_199552b423a_5cab",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [
                            114.28578668,
                            30.4929856
                        ],
                        [
                            114.28535037,
                            30.49330031
                        ],
                        [
                            114.28474956,
                            30.49266373
                        ],
                        [
                            114.28507402,
                            30.49234718
                        ],
                        [
                            114.28533607,
                            30.49209153
                        ],
                        [
                            114.28509288,
                            30.49137627
                        ],
                        [
                            114.28422742,
                            30.49018895
                        ],
                        [
                            114.28304725,
                            30.48978125
                        ],
                        [
                            114.28297182,
                            30.48974042
                        ],
                        [
                            114.2814517,
                            30.48770406
                        ],
                        [
                            114.28013968,
                            30.48594648
                        ],
                        [
                            114.27905783,
                            30.48418837
                        ],
                        [
                            114.27863582,
                            30.48446732
                        ],
                        [
                            114.27733833,
                            30.48256147
                        ],
                        [
                            114.27560364,
                            30.48001344
                        ],
                        [
                            114.27370626,
                            30.47722643
                        ],
                        [
                            114.27270556,
                            30.47575653
                        ],
                        [
                            114.27156845,
                            30.47423171
                        ],
                        [
                            114.26941984,
                            30.47147664
                        ],
                        [
                            114.26935646,
                            30.47140536
                        ],
                        [
                            114.26959987,
                            30.47122625
                        ],
                        [
                            114.26973555,
                            30.47112641
                        ],
                        [
                            114.26911328,
                            30.47000346
                        ],
                        [
                            114.26914365,
                            30.46969734
                        ],
                        [
                            114.26924076,
                            30.46871835
                        ],
                        [
                            114.26924702,
                            30.46865523
                        ],
                        [
                            114.26933742,
                            30.46463232
                        ],
                        [
                            114.26933955,
                            30.46438238
                        ],
                        [
                            114.2693524,
                            30.46287311
                        ],
                        [
                            114.26936675,
                            30.46118827
                        ],
                        [
                            114.26924516,
                            30.46085925
                        ]
                    ]
                },
                "geometry_name": "GEOM",
                "properties": {
                    "XLID": "b4fb2a8f428a7073a85680426f0156b4fac65b11d8",
                    "XLMC": "南生台线",
                    "DYDJ": "25",
                    "ZYCD": "57",
                    "WHBZ": "40288a6a71f04b03017228c5df0803f3",
                    "YWDW": "40288a6a6df58127016e0f6aca0b04f1",
                    "CITYID": "40288a6a6df58127016e0eabf90b00b3",
                    "GROUPID": null,
                    "OWNER": null
                }
            }]
      },
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
      let that = this;
      that.map = new SGMap.Map({
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
      that.map.on("load", () => {
        this.addLineLayer();
      });
    },
    addLineLayer() {
      that.map.addSource('power-lines', {
        type: 'geojson',
        data: this.channelData
      });

      // 2. 添加线的图层
      that.map.addLayer({
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
