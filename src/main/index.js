import { SendTracker } from './core/tracker';
import { loadConfig } from './core/loadConfig';
import { userBehaviorPlugin } from './plugins/userBehaviorPlugin';
import { performanceMonitorPlugin } from './plugins/performanceMonitorPlugin';
import { errorMonitorPlugin } from './plugins/errorMonitorPlugin';
import { renderingExceptionPlugin } from './plugins/renderingExceptionPlugin';

// 全局创建 Tracker 实例供插件使用
const tracker = new SendTracker();

// 默认配置项
const default_options = {
  hashPage: false,
  errorReport: true,
  performanceReport: true,
  blankReport: true,
  isLazyReport: false,
};

/**
 * 初始化配置
 * @param {object} options 配置项
 * @param {string} options.reportUrl 后端地址
 * @param {object} options.reportHeaderConfig 请求自定义配置,不配置则默认为 sendBeacon 和 img 的请求方式，配置后为 xhr 请求方式,请求方式为POST
 * 可以自定义配置为 xhr 的请求头信息，键值都为字符串。
 * @param {string} options.source 源信息
 * @param {string} options.appId 系统id
 * @param {boolean} options.isLazyReport 是否请求懒发送，多个请求会合并在一个请求里。默认关闭
 * @param {string} options.userId 用户的id, 配置后可用于统计uv
 * @param {boolean} options.hashPage 是否为哈希路由，默认为history
 * @param {boolean} options.errorReport 是否开启错误监控, 默认为开启，包括了 js 执行错误、期约未捕获的错误、资源加载错误和接口错误
 * @param {boolean} options.performanceReport 是否开启性能监控，默认为开启，监控首屏打开时间、绘制时间、最有意义的元素、首次交互延迟
 * @param {boolean} options.blankReport 是否开启白屏异常，默认为开启，监控异常白屏
 * @param {Array<string>} options.ignoreElement 白屏异常扫描时忽略的元素，即使这些元素渲染出来了依旧认为是空白。默认有 ['html', 'body', '#container', '.content']
 */
function init(options) {
  const configs = Object.assign(default_options, options);

  // 初始化配置
  extraInfoInit(configs);

  // 加载配置和插件
  loadConfig(
    [errorMonitorPlugin, performanceMonitorPlugin, userBehaviorPlugin, renderingExceptionPlugin],
    configs,
    tracker
  );

  // 页面关闭时发送缓存区里面的请求
  window.addEventListener('beforeunload', function (event) {
    if (tracker.cacheData.length !== 0) tracker.lazySend(null, true);
  });
}

/**
 * 自定义埋点数据
 * @param {object} data
 */
function trackSend(data) {
  tracker.send(data);
}

// 初始化额外信息
function extraInfoInit(configs) {
  const { appId, userId, reportUrl, source, isLazyReport, reportHeaderConfig } = configs;

  tracker.url = reportUrl;
  tracker.source = source;
  tracker.reportHeaderConfig = reportHeaderConfig;
  tracker.isLazy = isLazyReport;
  if (appId) {
    window['_monitor_app_id'] = appId;
  }
  if (userId) {
    window['_monitor_user_id'] = userId;
  }
}

export { init, trackSend };
