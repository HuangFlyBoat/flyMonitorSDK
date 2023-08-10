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
