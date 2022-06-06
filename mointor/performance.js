// 性能监控
// 1. 重定向时间，dns连接，tcp连接，白屏，首屏渲染时间从performance对象中获取，需要注意兼容性
// 2. 资源加载通过performanceObser监听获取
// 3. 插入的资源使用mutaionobserve获取

// 首次进入
// 参考https://juejin.cn/post/7031572366341701663#heading-3
function observeNavigationTiming() {
  const { performance } = window;
  const times = {};
  const t = performance.timing; // 已废弃，使用performance.getEntriesByType('navigation')代替

  if (!!performance.getEntriesByType) {
    const paintEntries = performance.getEntriesByType("paint");
    if (paintEntries.length)
      times.fmp = paintEntries[paintEntries.length - 1].startTime;

    // 优先使用 navigation v2  https://www.w3.org/TR/navigation-timing-2/
    if (performance.PerformanceNavigationTiming) {
      const nt2Timing = performance.getEntriesByType("navigation")[0];
      if (nt2Timing) t = nt2Timing;
    }
  }

  // 从开始发起这个页面的访问开始算起,减去重定向跳转的时间,在performanceV2版本下才进行计算,v1版本的fetchStart是时间戳而不是相对于访问起始点的相对时间
  if (times.fmp && supported.PerformanceNavigationTiming)
    times.fmp -= t.fetchStart;

  // 白屏时间 (从请求开始到浏览器开始解析第一批HTML文档字节的时间差)
  // times.fpt = t.responseEnd - t.fetchStart;

  times.tti = t.domInteractive - t.fetchStart; // 首次可交互时间

  times.ready = t.domContentLoadedEventEnd - t.fetchStart; // HTML加载完成时间

  times.loadon = t.loadEventStart - t.fetchStart; // 页面完全加载时间

  times.firstbyte = t.responseStart - t.domainLookupStart; // 首包时间

  times.dns = t.domainLookupEnd - t.domainLookupStart; // dns查询耗时

  times.appcache = t.domainLookupStart - t.fetchStart; // dns缓存时间

  times.tcp = t.connectEnd - t.connectStart; // tcp连接耗时

  times.ttfb = t.responseStart - t.requestStart; // 请求响应耗时

  times.trans = t.responseEnd - t.responseStart; // 内容传输耗时

  times.dom = t.domInteractive - t.responseEnd; // dom解析耗时

  times.res = t.loadEventStart - t.domContentLoadedEventEnd; // 同步资源加载耗时

  times.ssllink = t.connectEnd - t.secureConnectionStart; // SSL安全连接耗时

  times.redirect = t.redirectEnd - t.redirectStart; // 重定向时间

  times.unloadTime = t.unloadEventEnd - t.unloadEventStart; // 上一个页面的卸载耗时

  console.log("performance", times);
}

// 监听资源加载完成
function observeResource() {
  if (!PerformanceObserver) return;
  const observer = new PerformanceObserver(performance => {
    const observerTypeList = ["img", "link", "script", "audio", "video", "css"];
    // const entries = performance.getEntries(); // 获取全部观察事件
    const entries = performance.getEntriesByType("resource"); // 只获取resource事件
    // console.log("entries", entries);
    entries.forEach(entry => {
      const { initiatorType = "" } = entry;
      if (observerTypeList.indexOf(initiatorType.toLowerCase()) === -1) return;
      // 获取需要的资源属性，然后上报
      console.log("entry", entry);
    });
  });
  observer.observe({
    entryTypes: ["resource", "mark", "paint", "measure", "navigation"],
  }); // 观察各种类型的事件
}

function init() {
  observeNavigationTiming();
  observeResource();
}

init();
