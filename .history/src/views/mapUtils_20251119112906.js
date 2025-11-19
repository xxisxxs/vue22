import lineData from './data/lineData.json'
import TD from "./td.js";
import channelMultiData from "./tdd.js";
import channelFacilityData from "./tdsb.js";

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
function addChannelEquipment(channelFacilityData) {
  
  // ① 设备类型 → 图标映射表
  const imageMap = {
    '1': require("@/assets/img/1.png"),
    '2': require("@/assets/img/2.png"),
    '3': require("@/assets/img/3.png"),
    '4': require("@/assets/img/1.png"),
    '5': require("@/assets/img/2.png"),
    '6': require("@/assets/img/3.png"),
    '7': require("@/assets/img/2.png"),
    '8': require("@/assets/img/3.png")
  };

  // ② 按 sblxid 对数据分组
  const grouped = {};
  channelFacilityData.features.forEach((f) => {
    const sblxid = f.properties.sblxid || "其他";
    if (!grouped[sblxid]) grouped[sblxid] = [];
    grouped[sblxid].push(f);
  });

  // ③ 为每种设备类型加载图层
  Object.keys(grouped).forEach((sblxid) => {

    const imgUrl = imageMap[sblxid];
    if (!imgUrl) {
      console.warn(`未找到 ${sblxid} 对应的图标`);
      return;
    }

    const imageId = `icon-${sblxid}`;
    const sourceId = `source-${sblxid}`;
    const layerId  = `layer-${sblxid}`;

    // ⭐ 如果图片已加载 → 跳过 loadImage
    const addLayerWork = () => {

      // ③-1 添加 GeoJSON 数据源（存在则跳过）
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: grouped[sblxid]
          }
        });
      }

      // ③-2 添加图层（存在则跳过）
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "symbol",
          source: sourceId,
          layout: {
            "icon-image": imageId,
            "icon-size": 1.0,
            "icon-allow-overlap": true
          }
        });
      }
    };

    // ⭐⭐ 如果图片已加载 → 不再重复 loadImage
    if (map.hasImage(imageId)) {
      addLayerWork();
      return;
    }

    // ③-3 加载图片
    map.loadImage(imgUrl, (err, image) => {
      if (err) {
        console.error(`图片加载失败: ${imgUrl}`, err);
        return;
      }

      // 注册图片（重复检查）
      if (!map.hasImage(imageId)) {
        map.addImage(imageId, image);
      }

      addLayerWork();
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
      addPowerLines(lineData);
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
  addChannelSegment(channelMultiData);

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