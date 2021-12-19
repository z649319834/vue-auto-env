/**
 * 报错并退出
 * @param {String} msg 错误信息
 */
module.exports = msg => {
  console.error(msg)
  process.exit(1)
}
