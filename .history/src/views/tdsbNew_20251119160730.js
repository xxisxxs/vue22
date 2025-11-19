const arr = []
function addsblxId(val) {
  let sblxid = '';
  const sblxDic = [
    {key: '1', value: '转弯井'},
    {key: '2', value: '直通井'},
    {key: '3', value: '转角井'},
    {key: '4', value: '接头井'},
    {key: '5', value: '三通井'},
    {key: '6', value: '四通井'},
    {key: '7', value: '余缆井'},
    {key: '8', value: '直线井'}
  ];
  sblxDic.forEach(item => {
    if (item.value == val) {
      sblxid = item.key
    }
  }) 
  return sblxid
}
const lineGeo = {
  type: 'FeatureCollection',
  features:[]
};
arr.forEach(item => {
  lineGeo.features.push(
    {
      "type": "Feature",
      // "id": item.sbid,
      "geometry": {
          "type": "Point",
          "coordinates": item.geom_new
      },
      "properties": {
        "sbid": item.sbid,
        "tdid": item.tdid,
        "name": item.sbmc,
        "sblx": item.sblx,
        "sblxid": addsblxId(item.sblx),
        "fslx":item.fslx,
        "zycd": item.zycd,
        "whbz": item.whbz,
        "ywdw": item.ywdw,
        "cityid": item.cityid,
        "groupid": item.groupid,
        "owner": item.owner,
      }
    }
  )
});
export default lineGeo;