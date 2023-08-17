import { injectJsError } from "./lib/jsError";
import { injectXhrError } from "./lib/xhrError";
import { injectFetchError } from "./lib/fetchError";
import { blankScreen } from "./lib/blankScreen";
import { timing } from "./lib/timing";
import { SendTracker } from "./utils/tracker";


const tracker = new SendTracker();

/**
 * 初始化配置
 * @param {object} options 配置项
 * @param {string} options.reportUrl 后端地址
 * @param {string} options.source 源信息
 * @param {string} options.appId 系统id
 * @param {string} options.userId 用户的id
 * @param {boolean} options.autoTracker 是否开启默认埋点,默认为true
 * @param {boolean} options.delay 延迟合并上报的功能，多个请求将会整合为一个
 * @param {boolean} options.hashPage 是否为哈希路由，默认为history
 * @param {boolean} options.errorReport 是否开启错误监控
 * @param {Array<string>} options.ignoreElement 白屏异常扫描时忽略的元素，即使这些元素渲染出来了依旧认为是空白。默认有 ['html', 'body', '#container', '.content']
 */
function init(options) {
    tracker.url = options.reportUrl;
    tracker.source = options.source;
    injectJsError(tracker);
    injectXhrError(tracker);
    injectFetchError(tracker);
    blankScreen(tracker, options?.ignoreElement);
    timing(tracker);
}

/**
 * 自定义埋点
 * @param {object} data 
 */
function trackSend(data) {
    tracker.send(data);
}

export { init, trackSend }