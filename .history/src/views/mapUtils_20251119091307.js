export const genMap = (container, resLineData) => {
  const initMap = () => {
    const map = new SGMap.Map({
      // 地图绑定的DOM元素ID
      container: container,
      // 地图样式
      style: "aegis://styles/aegis/Satellite512",
      // 默认缩放层级
      zoom: 13,
      // 地图中心点
      center: [114.30137859, 30.44427428],
      // 地图默认字体
      localIdeographFontFamily: "Microsoft YaHei Regular"
    });
    const allLineData = convertLineData(resLineData)
    console.log('allLineData', allLineData)
    map.on('load', () => {
      map.addSource('power-lines', {
        type: 'geojson',
        data: allLineData
      });
      map.addLayer({
        id: 'power-lines-layer',
        type: 'line',
        source: 'power-lines',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          //dydj 电压字段 25:35kv  26:110kv  27:220kv      zycd 电缆字段 一级:55  二级:56  三级:57

          'line-color': [
            'match',
            ['get', 'dydj'],
            '25', 'red',
            '26', 'green',
            '27', 'blue',
            'pink'
          ],
          'line-width': 4
        }
      });
      map.addLayer({
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
          "text-max-width": 8,
        },
        paint: {
          "text-color": '#fff',
          "text-halo-color": "#000",
          "text-halo-width": 1.33333
        }
      });
    })
    return map
  }
  // 申请的key和sn
  return SGMap.tokenTask.login("9874acd812563f61a7fab126a6db9023", "a118728ce08f3baf971f1d682986cc08") //外网
    .then(() => initMap());
}
export const convertLineData = resData => {

  const res = {
    type: 'FeatureCollection',
    features: []
  }
  resData.forEach(item => {
    const { geom_new, dydj, zycd, ...rest } = item
    const o = {
      "type": "Feature",
      "id": 'GIS_XL.' + item.xlid,
      "geometry": {
        "type": "LineString",
        "coordinates": geom_new
      },
      "geometry_name": "GEOM",
      "properties": { ...rest, dydj: dydj.toString(), zycd: zycd.toString() }
    }
    //dydj 电压字段 25:35kv  26:110kv  27:220kv      zycd 电缆字段 一级:55  二级:56  三级:57
    /*
     properties={
    "xlid": "SBID0000002070A6C70E18467ABA2FCDD37A7EA005",
    "xlmc": "坪马线",
    "dydj": 26,
    "zycd": 57,
    "whbz": "8a65eadb75dbecd401763dbcfd164057",
    "ywdw": "8a65eadb75dbecd401763dbb3eef4051",
    "cityid": "8a65eadb75dbecd401763d27079c3023"
}
    */
    res.features.push(o)
  })
  return res
}
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