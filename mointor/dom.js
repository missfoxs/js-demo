const topNode = document.documentElement;
let result = [];
function getChild(node) {
  let temp;
  for (let i = 0; i < node.childNodes.length; i++) {
    temp = node.childNodes[i];
    if (temp.nodeType === 1) {
      result.push(temp);
    }
    if (temp.childNodes.length) {
      getChild(temp);
    }
  }
}
getChild(topNode);
console.log("result", result);
const map = new Map();
result.forEach(node => {
  const count = map.get(node.nodeName);
  if (count) {
    map.set(node.nodeName, count + 1);
  } else {
    map.set(node.nodeName, 1);
  }
});
// 对map进行排序，可以先转为数组再进行操作
console.log(
  Array.from(map)
    .sort((a, b) => b[1] - a[1])
    .map(item => item[0])
);
