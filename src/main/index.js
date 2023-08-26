
import { SendTracker } from "./utils/tracker";
import { loadConfig } from "./utils/loadConfig";


const tracker = new SendTracker();

// 默认配置项
const default_options = {
    delay: true,
    hashPage: false,
    errorReport: true,
    performanceReport: true,
    blankReport: true
}


/**
 * 初始化配置
 * @param {object} options 配置项
 * @param {string} options.reportUrl 后端地址
 * @param {object} options.reportHeaderConfig 请求自定义配置,不配置则默认为 sendBeacon 和 img 的请求方式，配置后为 xhr 请求方式,请求方式为POST
 * 可以自定义配置为 xhr 的请求头信息，键值都为字符串。
 * @param {string} options.source 源信息
 * @param {string} options.appId 系统id
 * @param {string} options.userId 用户的id,配置后可用于统计uv
 * @param {boolean} options.hashPage 是否为哈希路由，默认为history
 * @param {boolean} options.errorReport 是否开启错误监控, 默认为开启，包括了 js 执行错误、期约未捕获的错误、资源加载错误和接口错误
 * @param {boolean} options.performanceReport 是否开启性能监控，默认为开启，监控首屏打开时间、绘制时间、最有意义的元素、首次交互延迟
 * @param {boolean} options.blankReport 是否开启白屏异常，默认为开启，监控异常白屏
 * @param {Array<string>} options.ignoreElement 白屏异常扫描时忽略的元素，即使这些元素渲染出来了依旧认为是空白。默认有 ['html', 'body', '#container', '.content']
 */
function init (options) {
    loadConfig(Object.assign(default_options, options), tracker);
}

/**
 * 自定义埋点数据
 * @param {object} data 
 */
function trackSend (data) {
    tracker.send(data);
}

export { init, trackSend }