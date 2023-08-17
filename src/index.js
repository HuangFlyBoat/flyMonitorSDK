import { init, trackSend } from './main';

init({
    reportUrl: `https://huang-monitor.cn-chengdu.log.aliyuncs.com/logstores/huang-monitor-store/track`,
    source: 'PC',
})


document.getElementById('custom').addEventListener('click', function () {
    trackSend({
        kind: 'custom'
    })
});