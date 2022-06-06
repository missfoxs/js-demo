// 对于出错的监控，主要考虑一下几种
// 1. js执行错误 -> onerror, error事件捕获
// 2. 资源加载出错 -> 同js执行出错，注意不要重复发送即可
// 3. promise出错 -> 当promise被reject并且没有被处理时使用unhandledrejection捕获，error事件捕获不到？
// fetch和xmlHttpRequest方法 -> 劫持
// 托管在第三方的脚本报错，比如cdn上，添加crossorigin="anonymous"或者使用try catch
// 框架报错，比如vue用Vue.config.errorHandler = function (err, vm, info), react用componentDidCatch等

// 信息统一整合
function sendFullInfo() {}

// 捕获js报错
window.onerror = (msg, url, line, col, error) => {
  console.log(msg, url, line, col, error);
};

// 捕获资源加载错误
window.addEventListener(
  "error",
  e => {
    console.log(e);
    const { target } = e;
    const isElemetTarget =
      target instanceof HTMLScriptElement ||
      target instanceof HTMLImageElement ||
      target instanceof HTMLLinkElement;
    if (isElemetTarget) {
      console.log("dom error"); // 上报资源加载错误， onerror也可以捕获，这里防止重复捕获
    }
  },
  true
);

// 捕获ajax错误
function proxyAjax() {
  // const originonload = XMLHttpRequest.prototype.onload;
  // XMLHttpRequest.prototype.onload = response => {
  //   console.log(response);
  //   originonload.apply(this, response);
  // };
  const protocol = window.location.protocol;
  if (protocol === "file:") return;
  const { send, open } = XMLHttpRequest.prototype;
  XMLHttpRequest.prototype.send = function proxySend(body) {
    this.addEventListener("readystatechange", () => {
      const { readyState, status, responseURL, responseText } = this;
      if (readyState === 4) {
        // 请求已完成,且响应已就绪
        if (status === 200 || status === 304) {
          // 请求成功后采集
          // if (performanceServer) {
          //   performance.tracePerformance("server", {
          //     src: responseURL,
          //     responseStatus: status,
          //     duration: Date.now() - _config.triggerTime,
          //     params: body ? body : undefined,
          //   });
          // }
        } else {
          // 请求失败后采集
          // errorServer && error.traceError("server", responseText, {
          //   src: responseURL,
          //   responseStatus: status,
          //   params: body ? body : undefined,
          // });
        }
      }
    });
    return send.call(this, body);
  };
}

// 捕获fetch错误
function proxyFetch() {
  const originFetch = window.fetch;
  window.fetch = function (target, options = {}) {
    const result = originFetch.call(this, url, options);
    return result
      .then(res => {
        if (res.ok) {
          console.log(res);
          // 请求成功后采集
          // if (performanceServer) {
          //   performance.tracePerformance("server", {
          //     src: responseURL,
          //     responseStatus: status,
          //     duration: Date.now() - _config.triggerTime,
          //     params: body ? body : undefined,
          //   });
          // }
        }
      })
      .catch(err => {
        // 请求失败后采集
        // errorServer && error.traceError("server", responseText, {
        //   src: responseURL,
        //   responseStatus: status,
        //   params: body ? body : undefined,
        // });
      });
  };
}

// 未被捕获触发的事件
window.addEventListener("unhandledrejection", event => {
  console.log("promise", event);
});

// 被捕获之后触发的事件
window.addEventListener("rejectionhandled", err => {
  console.log("rejectionHandled", err);
});

function foo() {
  Promise.reject("Hello, Fundebug!").catch(err => console.log("catch"));
}

foo();
