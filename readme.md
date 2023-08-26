# 前端监控 SDK 使用文档

不侵入业务代码，轻量级的监控 SDK。

全局监控错误和异常

## 一、数据上传

采用阿里云日志服务提供的 WebTracking 来进行网络请求上传日志数据

https://help.aliyun.com/zh/sls/user-guide/use-the-web-tracking-feature-to-collect-logs?spm=a2c4g.11186623.0.0.79227466nAWvuw
https://help.aliyun.com/zh/sls/developer-reference/putwebtracking#reference-354467

## 二、监控错误范围

### 1. JS 执行错误

监听 window 下没有被捕获和处理的错误

```js
 window.addEventListener('error', function (event) {...}
```

### 2. 期约未捕获的错误

监控期约中出现的未被捕获的错误

```js
window.addEventListener('unhandledrejection', (event) => {...}
```

### 3. 资源加载错误

资源加载错误也是通过监听 error 事件来实现，对 event 进行一些判断来

```js
 window.addEventListener('error', function (event) {
    if (event.target && (event.target.src || event.target.href)) {
        // 说明是资源加载错误
        ...
    } else {
        // JS执行出错
    }
 }
```

### 4. 接口调用错误

分为 fetch 和 xhr 两个网络请求方式

对 Fetch 使用猴子补丁（monkey patching）重写了 window.fetch 实现中途拦截请求和响应信息.

对于 xhr 也是同理，保存其原来方法，然后修改其原型，在原型方法中进行拦截。
原型涉及到 open 和 send 方法

## 三、报错日志数据结构

```js
let log = {
  kind: 'stability', // 监控指标的大类
  type: 'error', // 小类
  errorType: 'jsError', // JS执行错误
  url: '', // 访问的url
  message: event.message, // 报错信息
  filename: event.filename, // 报错文件名
  position: `${event.lineno}:${event.colno}`,
  stack: getLines(event.error.stack),
  selector: lastEvent ? getSelector(lastEvent.composedPath()) : '', // 最后一个操作的元素
};
```

## 四、异常白屏检查

当没有错误被捕获，但是屏幕内容区域却没有正常渲染出元素时，仍然处于白屏状况。

- 通过 `document.readyState` 来调用回调函数进行白屏检查

> 一个文档的 readyState 可以是以下之一：
>
> - loading（正在加载）
> - document 仍在加载。
> - interactive（可交互）
>   文档已被解析，正在加载状态结束，但是诸如图像，样式表和框架之类的子资源仍在加载。
> - complete（完成）
>   文档和所有子资源已完成加载。表示 load 状态的事件即将被触发。

- `document.readyState` 是 JavaScript 中的一个属性，用于确定 HTML 文档的加载状态。它提供了关于文档是否已经解析并加载完成所有资源（例如图片、脚本和样式表）的信息。

- 在文档渲染完后执行对应回调函数，根据坐标点获取元素，对窗口的两条相邻边取其中位线上均匀分布的九个点，再取两条对角线上的十个点，一共 40 个点位进行扫描元素。

- `document.elementsFromPoint` 获取坐标点的所有元素，从外到内。如果扫描到的点返回的是最外层的元素则说明是白屏没有正常渲染。

```js
for (let i = 0; i < partLength; i++) {
  // 横竖中位线和对角线
  let xElements = document.elementsFromPoint(
    (window.innerWidth * i) / partLength,
    window.innerHeight / 2
  );
  let yElements = document.elementsFromPoint(
    window.innerWidth / 2,
    (window.innerHeight * i) / partLength
  );
  let xyElements = document.elementsFromPoint(
    (window.innerWidth * i) / partLength,
    (window.innerHeight * i) / partLength
  );
  let yxElements = document.elementsFromPoint(
    (window.innerWidth * i) / partLength,
    (window.innerHeight * (partLength - 1 - i)) / partLength
  );
  isWrapper(xElements[0]);
  isWrapper(yElements[0]);
  isWrapper(xyElements[0]);
  isWrapper(yxElements[0]);
}
```

当空白点数目大于总数的百分之九十时报警提示异常

## 五、性能观测

![PerformanceNavigationTiming 中定义的所有时间戳属性](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceNavigationTiming/timestamp-diagram.svg)

### 1、整体页面加载用时监测

核心接口 **PerformanceNavigationTiming** 提供了用于存储和检索有关浏览器文档事件的指标的方法和属性。例如，此接口可用于确定加载或卸载文档需要多少时间。并且它继承了 PerformanceResourceTiming 的所有属性和方法，

监测方式如下：

```js
const {
  // 开始获取当前页面资源的时间
  fetchStart,
  // TCP 连接开始时间
  connectStart,
  // TCP 握手结束时间
  connectEnd,
  // 开始正式发起请求时间
  requestStart,
  // 响应开始时间
  responseStart,
  // 响应结束时间
  responseEnd,
  // DOM可交互时间。它表示浏览器完成解析并准备加载子资源的时间戳。在此之前，页面的大部分内容已经解析完毕，用户可进行页面交互
  domInteractive,
  // 指示浏览器已经完全解析HTML文档并构建了DOM树，所有脚本文件已经可用，但可能还有其他资源（如图像）正在加载
  // 这意味着页面的结构已经可以访问和操作，但某些资源可能尚未完全加载
  domContentLoadedEventStart,
  domContentLoadedEventEnd,
  // 表示页面的所有资源（包括子资源）已经加载完成
  loadEventStart,
} = performance.getEntriesByType('navigation')[0];
```

上报数据如下：

```js
kind: 'experience', // 用户体验指标
type: 'timing', // 统计每个阶段的时间
connectTime: connectEnd - connectStart, // 连接时间
ttfbTime: responseStart - requestStart, // 首字节到达时间
responseTime: responseEnd - responseStart, // 响应的读取时间
parseDOMTime: loadEventStart - responseEnd, // DOM解析的时间
domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
loadTIme: loadEventStart - fetchStart // 完整的加载时间
```

### 2、 部分性能指标监测

> PerformanceResourceTiming 接口可以检索和分析有关加载应用程序资源的详细网络计时数据。应用程序可以使用 timing 指标来确定获取特定资源所需的时间长度，例如 XMLHttpRequest，`<SVG>`，image 或 script。这个接口使用 high-resolution timestamps 属性创建加载资源时间轴，用于网络事件，例如重定向开始 ( redirect start ) 和结束时间，获取开始 ( fetch start )，DNS 查找开始 ( DNS lookup start ) 和结束时间，响应开始 ( response start ) 和结束时间等。此外，接口扩展 PerformanceEntry 与其他属性，这些属性提供有关获取资源大小的数据以及初始化时获取的资源类型。

PerformanceObserver 来自定义观测页面中有意义的元素

- 首次有意义的元素绘制的时间 **FMP**

```js
new PerformanceObserver((entryList, observer) => {
  let perfEntries = entryList.getEntries();
  FMP = perfEntries[0];
  observer.disconnect();
}).observe({ entryTypes: ['element'] });
```

- 页面上最大的元素绘制的时间 **LCP**

```js
new PerformanceObserver((entryList, observer) => {
  let perfEntries = entryList.getEntries();
  LCP = perfEntries[0];
  observer.disconnect();
}).observe({ entryTypes: ['largest-contentful-paint'] });
```

- 首次将像素绘制到屏幕的时刻，包括了用户自定义的背景绘制 **FP**
  `performance.getEntriesByName('first-paint')[0];`

- 浏览器将第一个 DOM 渲染到屏幕的时间，相当于白屏时间 **FCP**
  `performance.getEntriesByName('first-contentful-paint')[0];`

- 用户首次交互的反应延迟和处理时间 **FID**

```js
new PerformanceObserver((entryList, observer) => {
  let lastEvent = getLastEvent();
  let firstInput = entryList.getEntries()[0];
  if (firstInput) {
    // processingStart开始处理的时间 startTime开点击的时间 差值就是处理的延迟
    let inputDelay = firstInput.processingStart - firstInput.startTime;
    let duration = firstInput.duration; // 处理的耗时
    if (inputDelay > 0 || duration > 0) {
      tracker.send({
        kind: 'experience', // 用户体验指标
        type: 'firstInputDelay', // 首次输入延迟
        inputDelay, // 延时的时间
        duration, // 处理的时间
        startTime: firstInput.startTime,
        selector: lastEvent ? getSelector(lastEvent || lastEvent.target) : '',
      });
    }
  }
  observer.disconnect();
}).observe({ type: 'first-input', buffered: true });
```

## 用户行为统计

### 1、PV 统计

针对 SPA 页面
分为 history 路由和 哈希 路由

### 2、uv 统计

在初始化时会发起一次请求，携带用户参数 userID
