import { injectJsError } from '../lib/jsError';
import { injectXhrError } from '../lib/xhrError';
import { injectFetchError } from '../lib/fetchError';
import { blankScreen } from '../lib/blankScreen';
import { timing } from '../lib/timing';
import { historyPageInject } from '../lib/hisotryInject';
import { hashPageInject } from '../lib/hashInject';
/**
 * 加载配置和代码注入
 * @param {*} options
 */
export function loadConfig(options, tracker) {
  const {
    appId,
    userId,
    reportUrl,
    source,
    isLazyReport,
    reportHeaderConfig,
    hashPage,
    errorReport,
    blankReport,
    ignoreElement,
    performanceReport,
  } = options;

  tracker.url = reportUrl;
  tracker.source = source;
  tracker.reportHeaderConfig = reportHeaderConfig;
  tracker.isLazy = isLazyReport;

  if (appId) {
    window['_monitor_app_id'] = appId;
  }

  if (userId) {
    window['_monitor_user_id'] = userId;
    tracker.send({
      kind: 'experience',
      type: 'uv',
    });
  }

  if (hashPage) {
    hashPageInject(tracker);
  } else {
    historyPageInject(tracker);
  }

  if (errorReport) {
    injectJsError(tracker);
    injectXhrError(tracker);
    injectFetchError(tracker);
  }

  if (performanceReport) {
    timing(tracker);
  }

  if (blankReport) {
    blankScreen(tracker, ignoreElement);
  }
}
