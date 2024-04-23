import { timing } from '../lib/timing';

// 性能监控插件
export function performanceMonitorPlugin(tracker) {
  // 监控页面加载时间等性能指标
  timing(tracker);
}
