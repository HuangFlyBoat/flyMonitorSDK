# 前端监控 SDK 使用文档

## 一、数据上传

采用阿里云日志服务提供的 WebTracking 来进行网络请求上传日志数据

https://help.aliyun.com/zh/sls/user-guide/use-the-web-tracking-feature-to-collect-logs?spm=a2c4g.11186623.0.0.79227466nAWvuw
https://help.aliyun.com/zh/sls/developer-reference/putwebtracking#reference-354467

## 二、监控错误范围

### 1. JS执行错误


### 2. 期约未捕获的错误


### 3. 资源加载错误


### 4. 接口调用错误

分为 fetch 和 xhr 两个网络请求方式

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

>一个文档的 readyState 可以是以下之一：
>
> - loading（正在加载）
> - document 仍在加载。
> - interactive（可交互）
>文档已被解析，正在加载状态结束，但是诸如图像，样式表和框架之类的子资源仍在加载。
> - complete（完成）
>文档和所有子资源已完成加载。表示 load 状态的事件即将被触发。


- `document.readyState` 是 JavaScript 中的一个属性，用于确定 HTML 文档的加载状态。它提供了关于文档是否已经解析并加载完成所有资源（例如图片、脚本和样式表）的信息。

- 在文档渲染完后执行对应回调函数，根据坐标点获取元素，对窗口的两条相邻边取其中位线上均匀分布的九个点，再取两条对角线上的十个点，一共 40 个点位进行扫描元素。

- `document.elementsFromPoint` 获取坐标点的所有元素，从外到内。如果扫描到的点返回的是最外层的元素则说明是白屏没有正常渲染。

```js
        for (let i = 0; i < partLength; i++) {
            // 横竖中位线和对角线
            let xElements = document.elementsFromPoint(
                window.innerWidth * i / partLength, window.innerHeight / 2);
            let yElements = document.elementsFromPoint(
                window.innerWidth / 2, window.innerHeight * i / partLength);
            let xyElements = document.elementsFromPoint(
                window.innerWidth * i / partLength, window.innerHeight * i / partLength);
            let yxElements = document.elementsFromPoint(
                window.innerWidth * i / partLength, window.innerHeight * (partLength - 1 - i) / partLength);
            isWrapper(xElements[0]);
            isWrapper(yElements[0]);
            isWrapper(xyElements[0]);
            isWrapper(yxElements[0]);
        }
```

当空白点数目大于总数的百分之九十时报警提示异常


## 五、性能观测

![PerformanceNavigationTiming 中定义的所有时间戳属性](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceNavigationTiming/timestamp-diagram.svg)

核心接口 **PerformanceNavigationTiming** 提供了用于存储和检索有关浏览器文档事件的指标的方法和属性。例如，此接口可用于确定加载或卸载文档需要多少时间。并且它继承了 PerformanceResourceTiming 的所有属性和方法，

> PerformanceResourceTiming 接口可以检索和分析有关加载应用程序资源的详细网络计时数据。应用程序可以使用 timing 指标来确定获取特定资源所需的时间长度，例如XMLHttpRequest，`<SVG>`，image 或 script。这个接口使用high-resolution timestamps 属性创建加载资源时间轴，用于网络事件，例如重定向开始 ( redirect start ) 和结束时间，获取开始 ( fetch start )，DNS 查找开始 ( DNS lookup start ) 和结束时间，响应开始 ( response start ) 和结束时间等。此外，接口扩展PerformanceEntry与其他属性，这些属性提供有关获取资源大小的数据以及初始化时获取的资源类型。


PerformanceObserver 来自定义观测页面中有意义的元素