import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";

export function injectJsError () {
    // 监控获取未处理的异常
    window.addEventListener('error', function (event) {
        let lastEvent = getLastEvent(); // 获取到最后一个交互事件
        // 说明是资源加载出错
        if (event.target && (event.target.src || event.target.href)) {
            tracker.send({
                kind: 'stability', //监控指标的大类
                type: 'error', //小类型 这是一个错误
                errorType: 'resourceError', //js或css资源加载错误
                filename: event.target.src || event.target.href, //哪个文件报错了
                tagName: event.target.tagName, //SCRIPT
                selector: getSelector(event) 
            });
        } else {
            tracker.send({
                kind: 'stability', //监控指标的大类
                type: 'error', //小类型 这是一个错误
                errorType: 'jsError', //JS执行错误
                message: event.message, //报错信息
                filename: event.filename, //哪个文件报错了
                position: `${event.lineno}:${event.colno}`,
                stack: getLines(event.error.stack),
                selector: lastEvent ? getSelector(lastEvent) : '' //代表最后一个操作的元素
            });
        }
    }, true);

    // 监控期约错误
    window.addEventListener('unhandledrejection', (event) => {
        let lastEvent = getLastEvent();
        let message = '';
        let filename = '';
        let line = 0;
        let column = 0;
        let stack = '';
        let reason = event.reason;
        if (typeof reason === 'string') {
            message = reason;
        } else if (typeof reason === 'object') {
            message = reason.message;
            if (reason.stack) {
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
                filename = matchResult[1];
                line = matchResult[2];
                column = matchResult[3];
                stack = getLines(reason.stack);
            }
        }

        tracker.send({
            kind: 'stability',
            type: 'error',
            errorType: 'promiseError',
            message,
            filename,
            position: `${line}:${column}`,
            selector: lastEvent ? getSelector(lastEvent) : ''
        })
    }, true);

    function getLines (stack) {
        // 清理stack中多余重复的信息，将 at 连接改为 ^ 连接
        return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join('^');
    }
}