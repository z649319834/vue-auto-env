/* eslint-disable */
/**
 * 尝试从npm scripts, 尝试读取--envtype后面的参数
 * npm run build --envtype prod
 * yarn run build --envtype prod
 * 注意：该方法直接作为npm包使用，所以需要写原生ES5代码，不然在其他模块或者浏览器中会报错
 */
module.exports = function getEnvFromNpmArgv() {
  var argv = process.env.npm_config_argv;
  if (!argv) return undefined;
  var copyData = JSON.parse(argv);
  return copyData && copyData.original.slice(-2)[0] === "--envtype"
    ? copyData.original.slice(-1)[0]
    : undefined;
};
