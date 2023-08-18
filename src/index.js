import { init, trackSend } from './main';

init({
    reportUrl: `https://huang-monitor.cn-chengdu.log.aliyuncs.com/logstores/huang-monitor-store/track`,
    source: 'PC',
    reportHeaderConfig: {
        'x-log-apiversion': '0.6.0',
        'Content-Type': 'application/json'
    }
})

document.getElementById('custom').addEventListener('click', function () {
    trackSend({
        kind: 'custom'
    })
})