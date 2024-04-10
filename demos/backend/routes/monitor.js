var express = require('express');
const { addLog } = require('../db/collections/monitor-log');
var router = express.Router();

router.post('/', async function (req, res, next) {
  const { body } = req;

  const source = body.__source__;
  const logs = body.__logs__ || [];

  if (logs.length > 0) {
    const promises = logs.map(async log => {
      await addLog({
        source,
        ...log,
      });
    });
    await Promise.all(promises);
  }

  res.send({
    code: 0,
    msg: 'create',
  });
});

module.exports = router;
