const fs = require('fs');

const arr = []
// 处理数据：将 geom_new 转为经纬度对数组
const newArr = arr.map(item => {
  const coords = item.geom_dw.split(/[,;\s]/).map(Number);
  const pairs = [];
  for (let i = 0; i < coords.length; i += 2) {
    if (i + 1 < coords.length) {
      pairs.push([coords[i], coords[i + 1]]);
    }
  }
  return {
    ...item,
    geom_dw: pairs
  };
});

// 将结果写入 JSON 文件（例如 output.json）
const outputPath = './zzzzoutput.json';
fs.writeFileSync(outputPath, JSON.stringify(newArr, null, 2), 'utf-8');

console.log(`数据已成功写入 ${outputPath}`);