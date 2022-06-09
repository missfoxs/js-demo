function loaded() {
  alert("Images loaded");
}

// 提前加载
function preloadImages(arr, cb) {
  const length = arr.length;
  let count = 0;
  function done() {
    count++;
    if (count === length) {
      cb();
    }
  }
  for (let i = 0; i < length; i++) {
    const img = document.createElement("img");
    img.src = arr[i];
    img.onload = img.onerror = done;
  }
}

preloadImages(["1.jpg", "2.jpg", "3.jpg"], loaded);
