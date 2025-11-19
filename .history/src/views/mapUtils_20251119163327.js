import lineData from './data/lineData.json'
import TD from "./td.js";
import channelMultiData from "./tdd.js";
import channelFacilityData from "./tdsbNew.js";

let map = null;
const POWER_COLOR_MAP = [
  'match',
  ['get', 'dydj'],
  '25', 'red',       // 35kV
  '26', 'green',     // 110kV
  '27', 'blue',      // 220kV
  'pink'
];

const CHANNEL_COLOR_MAP = [
  'match',
  ['get', 'fslx'],
  '106', '#FFD700',
  '105', '#FF00FF',
  '107', '#DC143C',
  '109', '#008000',
  '108', '#FFA500',
  '104', '#1E90FF',
  '#fff'
];

// 创建地图
function createMap(id) {
  return new SGMap.Map({
    container: id,
    style: "aegis://styles/aegis/Satellite512",
    zoom: 13,
    center: [114.30137859, 30.44427428],
    localIdeographFontFamily: "Microsoft YaHei Regular"
  });
}

// 安全添加 Source
function addGeoSource(id, data) {
  if (!map.getSource(id)) {
    map.addSource(id, {
      type: 'geojson',
      data
    });
  }
}
// 安全添加 Layer
function addMapLayer(layer) {
  if (!map.getLayer(layer.id)) {
    map.addLayer(layer);
  }
}
// 添加通道设备 
function addChannelEquipment(data) {




  const iconMap = {
    '1': require("@/assets/img/1.png"),
    '2': require("@/assets/img/2.png"),
    '3': require("@/assets/img/3.png"),
    '4': require("@/assets/img/4.png"),
    '5': require("@/assets/img/5.png"),
    '6': require("@/assets/img/6.png"),
    '7': require("@/assets/img/7.png"),
    '8': require("@/assets/img/8.png"),
  };

  let loadedCount = 0;
  const total = Object.keys(iconMap).length;

  Object.entries(iconMap).forEach(([key, url]) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      console.log("加载成功：", key, url);
      if (!map.hasImage("poi_" + key)) {
        map.addImage("poi_" + key, img);
      }
      console.log("poi_111111111",map.hasImage("poi_" + key)
)
      loadedCount++;

      if (loadedCount === total) {
        console.log("所有图片加载完成，开始绘制图层");

        addGeoSource("channel-points", data);
        // console.log("channel-points", data)
        addMapLayer({
          id: "channel-points-layer",
          type: "symbol",
          source: "channel-points",
          layout: {
            "icon-image": [
              "match",
              ["to-string", ["get", "sblxid"]],
              "1", "poi_1",
              "2", "poi_2",
              "3", "poi_3",
              "4", "poi_4",
              "5", "poi_5",
              "6", "poi_6",
              "7", "poi_7",
              "8", "poi_8",
              /* default */ "poi_1"
            ],
            "icon-size": 1,
            "text-field": "{name}",
            "text-size": 12,
            "text-anchor": "top",
            "icon-anchor": "bottom",
            "text-offset": [0, 0],
          },
          paint: {
            "text-color": "#ff0000",
            "text-halo-color": "#fff",
            "text-halo-width": 1,
          },
        });
        // console.log("channel-points-layerrrrrrrrrr",map.getLayer("channel-points-layer")
        console.log(map.getSource("channel-points")._data.features[0])
      }
    };

    img.onerror = (e) => {
      console.error("图片加载失败", url, e);
    };

    img.src = url.default || url;


map.loadImage(url, (error, image) => {
    if (error) throw error;
    map.addImage('poi_test', image);
    map.addLayer({
        id: 'layer_test',
        type: 'symbol',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [121.5, 31.2] },
                    properties: { name: '测试' }
                }]
            }
        },
        layout: {
            'icon-image': 'poi_test',
            'icon-size': 1
        }
    });
});


  });
}


// 添加通道段
function addChannelSegment(data) {
  addGeoSource('channel-lines', data);
  addMapLayer({
    id: 'channel-lines-layer',
    type: 'line',
    source: 'channel-lines',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': CHANNEL_COLOR_MAP,
      'line-width': 8
    }
  });
  addMapLayer({
    id: 'channel-lines-labels',
    type: 'symbol',
    source: 'channel-lines',
    layout: {
      "text-font": ["Microsoft YaHei Regular"],
      "symbol-placement": "line",
      "text-ignore-placement": true,
      "text-field": "{name}",
      "text-size": 16,
      "text-allow-overlap": false,
      "text-max-width": 8
    },
    paint: {
      "text-color": '#fff',
      "text-halo-color": "#000",
      "text-halo-width": 1.33333
    }
  });
}
// 添加电缆线路
function addPowerLines(allLineData) {
  addGeoSource('power-lines', allLineData);

  addMapLayer({
    id: 'power-lines-layer',
    type: 'line',
    source: 'power-lines',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': POWER_COLOR_MAP,
      'line-width': 4
    }
  });

  addMapLayer({
    id: 'power-lines-labels',
    type: 'symbol',
    source: 'power-lines',
    layout: {
      "text-font": ["Microsoft YaHei Regular"],
      "symbol-placement": "line",
      "text-ignore-placement": true,
      "text-field": "{xlmc}",
      "text-size": 16,
      "text-allow-overlap": false,
      "text-max-width": 8
    },
    paint: {
      "text-color": '#fff',
      "text-halo-color": "#000",
      "text-halo-width": 1.33333
    }
  });
}
// 主入口函数
export const genMap = (container) => {

  const initMap = () => {
    map = createMap(container);

    map.on('load', () => {
      // addPowerLines(lineData);
      addChannelEquipment(channelFacilityData);
    });

    return map;
  };
  // 登录并初始化地图
  return SGMap.tokenTask
    .login(
      "9874acd812563f61a7fab126a6db9023", 
      "a118728ce08f3baf971f1d682986cc08"
    )
    .then(() => initMap());
};

//dydj 电压字段 25:35kv  26:110kv  27:220kv      zycd 电缆字段 一级:55  二级:56  三级:57
export const filterCableLine = (map, { dydj = ['25', '26', '27'], zycd = [] } = {}) => {

  // 电压等级没选或者重要等级没选 - 隐藏所有
  if (dydj.length === 0 || zycd.length === 0) {
    const hideFilter = ['==', 'dydj', ''];
    map.setFilter('power-lines-layer', hideFilter);
    map.setFilter('power-lines-labels', hideFilter);
    return;
  }

  // 构建过滤条件
  const conditions = [['in', 'dydj', ...dydj]];
  zycd.length > 0 && conditions.push(['in', 'zycd', ...zycd]);

  // 应用过滤
  const filter = conditions.length > 1 ? ['all', ...conditions] : conditions[0];
  console.log('filter', filter)
  map.setFilter('power-lines-layer', filter);
  map.setFilter('power-lines-labels', filter);


};
// 通道段过滤
export const filterChannelLine = (map, { fslx = [], zycd = [] } = {}) => {
  // 铺设方式没选或者重要等级没选 - 隐藏所有
  // addChannelSegment(channelMultiData);

  if (fslx.length === 0 || zycd.length === 0) {
    const hideFilter = ['==', 'fslx', ''];
    map.setFilter('channel-lines-layer', hideFilter);
    map.setFilter('channel-lines-labels', hideFilter);
    return;
  }

  // 构建过滤条件
  const conditions = [['in', 'fslx', ...fslx]];
  zycd.length > 0 && conditions.push(['in', 'zycd', ...zycd]);

  // 应用过滤
  const filter = conditions.length > 1 ? ['all', ...conditions] : conditions[0];
  console.log('filterChannelLine', filter)
  map.setFilter('channel-lines-layer', filter);
  map.setFilter('channel-lines-labels', filter);
};