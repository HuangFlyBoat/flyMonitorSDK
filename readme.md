# 前端监控 SDK 使用文档

## 数据上传

采用阿里云日志服务提供的 WebTracking 来进行网络请求上传日志数据

https://help.aliyun.com/zh/sls/user-guide/use-the-web-tracking-feature-to-collect-logs?spm=a2c4g.11186623.0.0.79227466nAWvuw
https://help.aliyun.com/zh/sls/developer-reference/putwebtracking#reference-354467

## 报错日志数据结构

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

## 异常白屏检查

当没有错误被捕获，但是屏幕内容区域却没有正常渲染出元素时，仍然处于白屏状况。

通过 `document.readyState` 来调用回调函数进行白屏检查

`document.readyState` 是 JavaScript 中的一个属性，用于确定 HTML 文档的加载状态。它提供了关于文档是否已经解析并加载完成所有资源（例如图片、脚本和样式表）的信息。

接着执行对应回调函数，根据坐标点获取元素，对窗口的两条相邻边取其中位线上均匀分布的九个点，再取两条对角线上的九个点，一共36个点位进行扫描元素。