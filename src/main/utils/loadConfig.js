
/**
 * 加载配置和代码注入
 * @param {*} options 
 */
export function loadConfig(options) {
    const {
        appId, // 系统id
        userId, // 用户的id
        reportUrl, // 后端的url
        autoTracker, // 是否开启无恒埋点
        delay, // 延迟合并上报的功能
        hashPage, // 是否为哈希路由
        errorReport // 是否开启错误监控
    } = options;

    if (appId) {
        window['_monitor_app_id'] = appId;
    }

    if (userId) {
        window['_monitor_user_id'] = userId;
    }

    if (reportUrl) {
        window['_monitor_report_id'] = reportUrl;
    }

    if (delay) {
        window['_monitor_delay_'] = delay;
    }

    if (autoTracker) {
        // TO DO
    }

    if (hashPage) {
        // TO DO
    } else {
        // history API
    }

    if (errorReport) {
        // TO DO
    }
}