import { historyPageInject } from '../lib/hisotryInject';
import { hashPageInject } from '../lib/hashInject';

// 用户行为插件
export function userBehaviorPlugin(tracker, configs) {
  // 注入页面浏览统计逻辑
  if (configs.userId) {
    // 如果有用户ID，则进行UV统计
    tracker.send({
      kind: 'experience',
      type: 'uv',
    });
  }

  // 注入页面浏览统计逻辑
  if (configs.hashPage) {
    hashPageInject(tracker);
  } else {
    historyPageInject(tracker);
  }
}
