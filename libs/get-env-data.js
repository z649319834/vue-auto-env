/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')
const errorAndExit = require('./error-and-exit')

const cwd = process.cwd()
const envJsonPath = path.resolve(cwd, 'env.json')
const envJsPath = path.resolve(cwd, 'env.js')
const envTsPath = path.resolve(cwd, 'env.ts')
const envTemplatePath = path.resolve(__dirname, '../env.json')

/**
 * 执行配置文件
 * @param {String} path 文件路径
 * @param {String} type 类型
 */
// eslint-disable-next-line consistent-return
const getDataFromFile = (filePath, type) => {
  console.info(`尝试读取: ${filePath}`)
  try {
    // eslint-disable-next-line global-require
    return require(filePath)(type)
  } catch (error) {
    console.error(error)
    errorAndExit(`执行配置文件失败: ${filePath}`)
  }
}

// eslint-disable-next-line consistent-return
module.exports = type => {
  const jsonConfigExist = fs.existsSync(envJsonPath)
  const jsConfigExist = fs.existsSync(envJsPath)
  const tsConfigExist = fs.existsSync(envTsPath)
  if (jsonConfigExist && (jsConfigExist || tsConfigExist)) {
    console.warn(
      'env.json 和env.js 文件同时存在，优先采用env.js，请及时确认，并删除其中一个配置文件'
    )
  }
  // 尝试读取env.js配置文件
  if (jsConfigExist) {
    return getDataFromFile(envJsPath, type)
  }
  // 尝试读取env.ts配置文件
  if (tsConfigExist) {
    return getDataFromFile(envTsPath, type)
  }
  // 尝试读取env.json 配置文件
  if (jsonConfigExist) {
    const envData = require(envJsonPath)
    const typeData = envData[type]

    if (!typeData) {
      errorAndExit(`env.json中未找到type:${type} 对应的数据`)
    }
    return typeData
  }
  const envFilePath = path.resolve(cwd, 'env.json')
  fs.copyFileSync(envTemplatePath, envFilePath)
  errorAndExit(
    `env.json文件未配置, 已自动创建该配置模板, 请配置后再使用该命令${envFilePath}`
  )
}
