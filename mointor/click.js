// 容易被覆盖，且无效点击太多
function proxyClick() {
  document.addEventListener("click", event => {
    console.log("click", event);
    // 点击时判断元素类型，并且获取元素上的参数值。
  });
}

// proxyClick()
