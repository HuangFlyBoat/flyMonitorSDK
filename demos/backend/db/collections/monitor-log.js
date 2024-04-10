// 引入mongoose和定义的Schema
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 定义monitorSchema
const monitorSchema = new Schema({
  source: String, // 来源
  title: String, // 网站名称
  url: String, // 访问地址
  appId: String, // appid
  userId: String, // 用户id，用于统计 uv
  kind: String, // 用户体验指标 experience、stability...
  type: String, // 具体子类型 xhr、time、error
  timestamp: String, // 时间戳
  userAgent: String, // 用户环境
});

// 创建Model
const monitorLogs = mongoose.model('monitorLogs', monitorSchema);

// 增加数据
const addLog = async logData => {
  try {
    const log = new monitorLogs(logData);
    const savedLog = await log.save();
    console.log('Log Added:', savedLog);
  } catch (error) {
    console.error('Add Log Error:', error);
  }
};

// 查询数据
const findLogs = async query => {
  try {
    const logs = await monitorLogs.find(query);
    console.log('Logs Found:', logs);
  } catch (error) {
    console.error('Find Logs Error:', error);
  }
};

// 更新数据
const updateLog = async (logId, updateData) => {
  try {
    const updatedLog = await monitorLogs.findByIdAndUpdate(logId, updateData, { new: true });
    console.log('Log Updated:', updatedLog);
  } catch (error) {
    console.error('Update Log Error:', error);
  }
};

// 删除数据
const deleteLog = async logId => {
  try {
    const deletedLog = await monitorLogs.findByIdAndDelete(logId);
    console.log('Log Deleted:', deletedLog);
  } catch (error) {
    console.error('Delete Log Error:', error);
  }
};

module.exports = {
  addLog,
  findLogs,
  updateLog,
  deleteLog,
};

// 使用示例
// addLog({ __source__: 'source_example', __logs__: ['log1', 'log2'] });
// findLogs({ __source__: 'source_example' });
// updateLog('some-log-id', { __logs__: ['updated_log1', 'updated_log2'] });
// deleteLog('some-log-id');
