import { injectJsError } from '../lib/jsError';
import { injectXhrError } from '../lib/xhrError';
import { injectFetchError } from '../lib/fetchError';

// 错误监控插件
export function errorMonitorPlugin(tracker) {
  // 注入JS错误监控
  injectJsError(tracker);
  // 注入XHR错误监控
  injectXhrError(tracker);
  // 注入Fetch错误监控
  injectFetchError(tracker);
}
