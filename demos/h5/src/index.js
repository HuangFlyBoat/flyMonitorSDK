import { init, trackSend } from '../../../src/main';

init({
  reportUrl: `http://localhost:3000/monitor`,
  source: 'PC',
  hashPage: true,
  isLazyReport: true,
});

document.getElementById('custom').addEventListener('click', function () {
  trackSend({
    kind: 'custom',
  });
});
