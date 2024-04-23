import userAgent from 'user-agent';

function getExtraInfo() {
  return {
    title: document.title,
    url: window.location.href,
    appId: window['_monitor_app_id'] || '',
    userId: window['_monitor_user_id'] || '',
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name,
  };
}

class SendTracker {
  url = '';
  source = '';
  // 懒发送节流的时间
  delay = 4000;
  // 懒发送缓存数据
  cacheData = [];
  timer = null;
  isLazy = false;

  // 创建请求日志
  _privateCreateLog(data = {}, isSubElement = false) {
    let extraInfo = getExtraInfo();
    let log = isSubElement
      ? { ...extraInfo, ...data }
      : {
          __source__: this.source,
          __logs__: [{ ...extraInfo, ...data }],
        };
    // 对象的值不能为数字
    if (isSubElement) {
      for (let key in log) {
        if (typeof log[key] === 'number') {
          log[key] = `${log[key]}`;
        }
      }
    } else {
      for (let obj of log.__logs__) {
        for (let key in obj) {
          if (typeof obj[key] === 'number') {
            obj[key] = `${obj[key]}`;
          }
        }
      }
    }
    return log;
  }

  lazySend(data, isNow = false) {
    if (data) {
      this.cacheData.push(data);
    }
    const log = {
      __source__: this.source,
      __logs__: this.cacheData,
    };
    // 页面关闭时发送缓存数据
    if (isNow) {
      this._privateSendByDefault(log);
      return;
    }
    // 节流实现延迟传输并且合并请求
    if (!this.timer) {
      this.timer = setTimeout(() => {
        if (this.reportHeaderConfig) {
          this._privateSendByXhr(log);
        } else {
          this._privateSendByDefault(log);
        }
        this.timer = null;
      }, this.delay);
    }
  }

  // 每次发送完清理一下缓存
  clearCache() {
    this.cacheData = [];
  }

  // https://help.aliyun.com/zh/sls/developer-reference/putwebtracking#reference-354467 阿里云日志请求格式
  /**
   * 发送日志给后台服务，根据 monitor 初始化时的配置项决定请求方式
   * 默认为 sendBeacon 方式，不兼容则为 img 方式
   * 如果有配置则采用用户自定义的配置发起 xhr 请求
   * @param {object} data
   */
  send(data = {}) {
    if (this.isLazy) {
      let log = this._privateCreateLog(data, true);
      this.lazySend(log);
    } else {
      let log = this._privateCreateLog(data);
      if (this.reportHeaderConfig) {
        this._privateSendByXhr(log);
      } else {
        this._privateSendByDefault(log);
      }
    }
  }

  _privateSendByDefault(body = {}) {
    if (navigator.sendBeacon) {
      console.log(body);
      const blob = new Blob([JSON.stringify(body)], {
        type: 'application/json',
      });
      console.log(blob);
      const res = navigator.sendBeacon(this.url, blob);
      // 请求成功res为true
      if (res) {
        this.clearCache();
      }
    } else {
      let that = this;
      let oImage = new Image();
      oImage.src = `${this.url}?logs=${body}`;
      oImage.onload = function () {
        that.clearCache();
      };
    }
  }

  _privateSendByXhr(body = {}) {
    const data = JSON.stringify(body);
    const xhr = new XMLHttpRequest();
    let that = this;
    xhr.open('POST', this.url, true);
    xhr.setRequestHeader('x-log-apiversion', '0.6.0');
    xhr.setRequestHeader('x-log-bodyrawsize', data.length);
    for (const key in this.reportHeaderConfig) {
      xhr.setRequestHeader(key, this.reportHeaderConfig[key]);
    }
    xhr.onerror = function (error) {
      console.log('error', error);
      that.clearCache();
    };
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          that.clearCache();
        }
      }
    };
    xhr.send(data);
  }
}

export { SendTracker };
