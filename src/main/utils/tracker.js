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
    delay = 4000;
    cacheData = [];
    timer = null;
    isLazy = false;

    /**
     * 
     * @param {string} reportUrl 后端地址
     * @param {string} source 源
     * @param {object} reportHeaderConfig 请求配置
     */
    constructor(reportUrl, source, reportHeaderConfig) {
        this.url = reportUrl;
        this.source = source || '';
        this.reportHeaderConfig = reportHeaderConfig || {};

        // 说明上一次页面异常关闭, 有来不及发送的请求，
        // let lastCache = localStorage.getItem('fly-monitor-cache')
        // if (lastCache) {
        //     this.cacheData = this.cacheData.concat(lastCache);
        // }
        // 页面关闭时发送缓存区里面的请求
        window.addEventListener('unload',function () {
            if(this.cacheData.length !== 0) this.lazySend({}, true);
        })
    }

    // 创建请求日志
    _privateCreateLog (data = {}, isSubElement = false) {
        let extraInfo = getExtraInfo();
        let log = isSubElement ? {...extraInfo, ...data} : {
            __source__: this.source,
            __logs__: [{ ...extraInfo, ...data }]
        };
        // 对象的值不能为数字
        if (isSubElement) {
            for(let key in log){
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


    lazySend (data, isNow = false){
        if (data) {
            this.cacheData.push(data);
        }
        let log = {
            __source__: this.source,
            __logs__: this.cacheData
        };
        // 特殊情况需要立即执行，比如页面突然关闭。又或者打开页面发现有上一次的缓存数据
        // if (isNow) {
        //     let body = localStorage.getItem('fly-monitor-cache');
        //     log.__logs__ = this.cacheData.concat(body);
        //         if (this.reportHeaderConfig) {
        //             this._privateSendByXhr(JSON.stringify(log));
        //         } else {
        //             this._privateSendByDefault(JSON.stringify(log));
        //         }
        //     return;
        // }
        localStorage.setItem('fly-monitor-cache',this.cacheData);
        // 节流实现延迟传输并且合并请求
        if (!this.timer){
            this.timer = setTimeout(() => {
                if (this.reportHeaderConfig) {
                    console.log(log);
                    this._privateSendByXhr(JSON.stringify(log));
                } else {
                    this._privateSendByDefault(JSON.stringify(log));
                }
                this.timer = null;
            }, this.delay);
        }
    }

    // 每次发送完清理一下缓存
    clearCache (){
        this.cacheData = [];
        localStorage.setItem('fly-monitor-cache',[]);
    }

    // https://help.aliyun.com/zh/sls/developer-reference/putwebtracking#reference-354467 阿里云日志请求格式
    /**
     * 发送日志给后台服务，根据 monitor 初始化时的配置项决定请求方式
     * 默认为 sendBeacon 方式，不兼容则为 img 方式
     * 如果有配置则采用用户自定义的配置发起 xhr 请求
     * @param {object} data 
     */
    send (data = {}) {
        if (this.isLazy) {
            let log = this._privateCreateLog(data, true);
            this.lazySend(log);
        } else {
            let log = this._privateCreateLog(data);
            let body = JSON.stringify(log);
            if (this.reportHeaderConfig) {
                this._privateSendByXhr(body);
            } else {
                this._privateSendByDefault(body);
            }
        }
    }

    _privateSendByDefault (body = {}) {
        if (navigator.sendBeacon) {
            navigator.sendBeacon(this.url, body);
            // 这个无法判断请求是否成功，只能通过 unload 事件来处理了
        } else {
            let that = this;
            let oImage = new Image();
            oImage.src = `${this.url}?logs=${body}`;
            oImage.onload = function () {
                that.clearCache();
            }
        }
        console.log('log', body);
    }

    
    _privateSendByXhr (body = {}) {
        const xhr = new XMLHttpRequest;
        let that = this;
        xhr.open('POST', this.url, true);
        console.log('log', body);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-log-apiversion', '0.6.0');
        xhr.setRequestHeader('x-log-bodyrawsize', body.length);
        for(const key in this.reportHeaderConfig){
            xhr.setRequestHeader(key, this.reportHeaderConfig[key]);
        }
        xhr.onerror = function (error) {
            console.log('error', error)
        };
        xhr.onload = function (){
            if(xhr.status === 200){
                that.clearCache();
            }
        }
        this.clearCache();
        xhr.send(body);
    }
}

export { SendTracker };