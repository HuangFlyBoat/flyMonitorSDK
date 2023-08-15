import { injectJsError } from "./lib/jsError";
import { injectXhrError } from "./lib/xhrError";
import { injectFetchError } from "./lib/fetchError";
import { blankScreen } from "./lib/blankScreen";
import { timing } from "./lib/timing";
import { SendTracker } from "./utils/tracker";


/**
 * @typedef {Object} ConfigObject
 * @property {string} source - 源信息
 * @property {Array<string>} monitorURL - 需要监测的接口URL数组
 * @property {Array<string>} ignoreElement - 白屏扫描时忽略的元素，如 ['.content','#main']
 */

/**
 * 按照阿里云日志服务里的自定义填写 https://${project}.${host}/logstores/${logstoreName}/track
 * @param {string} project 
 * @param {string} host 
 * @param {string} logstoreName 
 * @param {ConfigObject} config 
 */
export function monitorInit (project, host, logstoreName, config) {
    const tracker = new SendTracker(project, host, logstoreName, config.source)
    injectJsError(tracker);
    injectXhrError(tracker);
    injectFetchError(tracker);
    blankScreen(tracker);
    timing(tracker);
}