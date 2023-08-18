let userAgent = require('user-agent');

function getExtraInfo () {
    return {
        title: document.title,
        url: window.location.href,
        appId: window['_monitor_app_id'] || '',
        userId: window['_monitor_user_id'] || '',
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent).name
    }
}

class SendTracker {
    /**
     * 
     * @param {string} reportUrl 后端地址
     * @param {string} source 源
     * @param {object} reportConfig 请求配置
     */
    constructor(reportUrl, source, reportHeaderConfig) {
        this.url = reportUrl;
        this.source = source || '';
        this.reportHeaderConfig = reportHeaderConfig || {};
    }


    _privateCreateLog (data = {}) {
        let extraInfo = getExtraInfo();
        let log = {
            __source__: this.source,
            __logs__: [{ ...extraInfo, ...data }]
        };
        // 对象的值不能为数字
        for (let obj of log.__logs__) {
            for (let key in obj) {
                if (typeof obj[key] === 'number') {
                    obj[key] = `${obj[key]}`;
                }
            }
        }
        return log;
    }

    // https://help.aliyun.com/zh/sls/developer-reference/putwebtracking#reference-354467 阿里云日志请求格式
    /**
     * 发送日志给后台服务，根据 monitor 初始化时的配置项决定请求方式
     * 默认为 sendBeacon 方式，不兼容则为 img 方式
     * 如果有配置则采用用户自定义的配置发起 xhr 请求
     * @param {object} data 
     */
    send (data = {}) {
        if (this.reportConfig) {
            _privateSendByXhr(data);
        } else {
            _privateSendByDefault(data);
        }
    }

    _privateSendByDefault (data = {}) {
        let log = _privateCreateLog(data);
        let body = JSON.stringify(log);
        if (navigator.sendBeacon) {
            navigator.sendBeacon(this.url, body);
        } else {
            let oImage = new Image();
            oImage.src = `${this.url}?logs=${body}`;
        }
        console.log('log', log);
    }

    _privateSendByXhr (data = {}) {
        let log = _privateCreateLog(data);
        const xhr = new XMLHttpRequest;
        xhr.open('POST', this.url, true);
        let body = JSON.stringify(log);
        console.log('log', log);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-log-apiversion', '0.6.0');
        xhr.setRequestHeader('x-log-bodyrawsize', body.length);
        for(const key in this.reportHeaderConfig){
            xhr.setRequestHeader(key, this.reportHeaderConfig[key]);
        }
        xhr.onerror = function (error) {
            console.log('error', error)
        };
        xhr.send(body);
    }
}

export { SendTracker };