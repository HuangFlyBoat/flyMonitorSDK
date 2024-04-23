import { blankScreen } from '../lib/blankScreen';

// 渲染异常监控插件
export function renderingExceptionPlugin(tracker, configs) {
  if (configs.blankReport) {
    blankScreen(tracker, configs.ignoreElement);
  }
}
