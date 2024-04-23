/**
 * 加载配置和插件初始化
 * @param {Array<Function>} plugins 插件列表
 * @param {Object} configs 配置项
 * @param {*} tracker Tracker实例
 */
export function loadConfig(plugins, configs, tracker) {
  plugins.forEach(plugin => {
    plugin(tracker, configs);
  });
}
