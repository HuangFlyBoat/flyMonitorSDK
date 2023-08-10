let host = 'cn-chengdu.log.aliyuncs.com';
let project = 'huang-monitor';
let logstoreName = 'huang-monitor-store';
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
    constructor() {
        this.url = `https://${project}.${host}/logstores/${logstoreName}/track`;
        this.xhr = new XMLHttpRequest;
    }
    // https://help.aliyun.com/zh/sls/developer-reference/putwebtracking#reference-354467 阿里云日志请求格式
    send (data = {}) {
        let extraInfo = getExtraInfo();
        let log = {
            __source__: '',
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

export default new SendTracker();