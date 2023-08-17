let userAgent = require('user-agent');

function getExtraInfo () {
    return {
        title: document.title,
        url: location.url,
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent).name
    }
}

class SendTracker {
    /**
     * 
     * @param {string} project 主机名 
     * @param {string} host 域名
     * @param {string} logstoreName 存储名
     * @param {string} source 源
     */
    constructor(reportUrl, source) {
        this.url = reportUrl;
        this.xhr = new XMLHttpRequest;
        this.source = source || '';
    }
    // https://help.aliyun.com/zh/sls/developer-reference/putwebtracking#reference-354467 阿里云日志请求格式
    send (data = {}) {
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
        this.xhr.open('POST', this.url, true);
        let body = JSON.stringify(log);
        console.log('log', log);
        this.xhr.setRequestHeader('Content-Type', 'application/json');
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);
        this.xhr.onerror = function (error) {
            console.log('error', error)
        };
        this.xhr.send(body);
    }
}

export { SendTracker };