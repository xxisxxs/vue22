import lineData from './data/lineData.json'
import TD from "./td.js";
import channelMultiData from "./tdd.js";
import TDSB from "./tdsb.js";

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
  if (map.getSource(id)) {
    map.getSource(id).setData(data);
  } else {
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
      addPowerLines(lineData);

      addChannelSegment(channelMultiData);
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
export const filterMap = (map, { dydj = ['25', '26', '27'], zycd = [] } = {}) => {

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