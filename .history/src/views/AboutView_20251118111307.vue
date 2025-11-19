<template>
  <div id="map" style="width: 100%; height: 100%"></div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  beforeCreate(){
    this.map=null
    this.
  },
  mounted() {
     // 申请的key和sn
    SGMap.tokenTask
      .login("9874acd812563f61a7fab126a6db9023", "a118728ce08f3baf971f1d682986cc08") //外网
      .then(() => {
        this.loadPlugin();
      });
  },
  methods: {
     loadPlugin() {
       this.initMap();
      // SGMap.plugin("SGMap.ConvertTask").then(function (res) {
      //   this.convertTask = new SGMap.ConvertTask();
      // });
    }, 
    initMap() {
      this.map = new SGMap.Map({
        // 地图绑定的DOM元素ID
        container: "map",
        // 地图样式
        style: "aegis://styles/aegis/Satellite512",
        // 默认缩放层级
        zoom: 13,
        // 地图中心点
        center: [114.30137859, 30.44427428],
        // 地图默认字体
        localIdeographFontFamily: "Microsoft YaHei Regular",
      });
      // map.on('load', () => {

      //   map.addSource('power-lines', {
      //     type: 'geojson',
      //     data: totalLineData
      //   });
      //   map.addLayer({
      //     id: 'power-lines-layer',
      //     type: 'line',
      //     source: 'power-lines',
      //     layout: {
      //       'line-join': 'round',
      //       'line-cap': 'round'
      //     },
      //     paint: {
      //       'line-color': [
      //         'match',
      //         ['get', 'type'],
      //         '35kv', 'red',
      //         '110kv', 'blue',
      //         '220kv', 'green',
      //         'diangouxian', 'yellow',
      //         'suidao', 'pink',
      //         '#ccc'
      //       ],
      //       'line-width': 3
      //     }
      //   });
      //   map.addLayer({
      //     id: 'power-lines-labels',
      //     type: 'symbol',
      //     source: 'power-lines',
      //     layout: {
      //       "text-font": ["Microsoft YaHei Regular"],
      //       "symbol-placement": "line",
      //       "text-ignore-placement": true,
      //       "text-field": "{name}",
      //       "text-size": 16,
      //       "text-allow-overlap": false,
      //       "text-max-width": 8,
      //     },
      //     paint: {
      //       "text-color": '#fff',
      //       "text-halo-color": "#000",
      //       "text-halo-width": 1.33333
      //     }
      //   });
      // })
    }
  }
}
</script>
<style>

</style>

