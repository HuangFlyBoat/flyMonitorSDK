/**
 * 针对调用接口 xhr 的错误捕获
 */
export function injectXhrError(tracker) {
  // 思路：对于XMLHttpRequest的open和send方法进行了重写，传入日志
  const XMLHttpRequest = window.XMLHttpRequest;
  const oldOpen = XMLHttpRequest.prototype.open;
  const oldSend = XMLHttpRequest.prototype.send;

  // 修改现有原型方法，进行预处理后再调用老方法执行原有操作
  XMLHttpRequest.prototype.open = function (method, url, async) {
    // 接口白名单，不会捕获上报接口
    if (!url.match(tracker.url)) {
      // 调用时加入自定义日志
      this.logData = { method, url, async };
    }
    return oldOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    if (this.logData) {
      // 记录正式发起请求前时间
      let startTime = Date.now();
      // 给 xhr 添加请求回调函数
      let handler = type => event => {
        let duration = Date.now() - startTime;
        let status = this.status;
        let statusText = this.statusText;
        tracker.send({
          kind: 'stability',
          type: 'xhr',
          eventType: type,
          pathname: this.logData.url,
          status: status + '-' + statusText, // 状态码
          duration, // 持续时间
          response: this.response ? JSON.stringify(this.response) : '',
          params: body || '',
        });
      };
      this.addEventListener('load', handler('load'), false);
      this.addEventListener('error', handler('error'), false);
      this.addEventListener('abort', handler('abort'), false);
    }
    return oldSend.apply(this, arguments);
  };
}
