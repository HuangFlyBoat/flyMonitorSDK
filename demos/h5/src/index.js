import { init, trackSend } from '../../../src/main';

init({
  reportUrl: `http://localhost:3000/monitor`,
  source: 'PC',
  reportHeaderConfig: {
    'x-log-apiversion': '0.6.0',
    'Content-Type': 'application/json',
  },
  hashPage: true,
  isLazyReport: false,
});

document.getElementById('custom').addEventListener('click', function () {
  trackSend({
    kind: 'custom',
  });
});
