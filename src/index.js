import {monitorInit} from './main';
let host = 'cn-chengdu.log.aliyuncs.com';
let project = 'huang-monitor';
let logstoreName = 'huang-monitor-store';

monitorInit(project, host, logstoreName);