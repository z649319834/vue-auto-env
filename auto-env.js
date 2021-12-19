#!/usr/bin/env node
/* eslint-disable camelcase */

const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
const outputPath = path.resolve(cwd, '.env.local')
let type = process.argv[2] || 'prod'
const endOfLine = require('os').EOL
const errorAndExit = require('./libs/error-and-exit')
const getEnvData = require('./libs/get-env-data')
const getEnvFromNpmArgv = require('./libs/get-env-from-npm-argv')

if (fs.existsSync(outputPath)) {
  console.warn('检测到已生成的.env.local文件，尝试删除重新生成...')
  fs.unlinkSync(outputPath)
}

// 从npm 脚本参数中获取 type值
type = getEnvFromNpmArgv() || type

if (!type) {
  errorAndExit('请传入指定环境类型：type。')
}

console.info(`当前evntype: ${type}`)

// 获取所需的环境数据
const typeData = getEnvData(type)

if (!typeData) {
  errorAndExit(`env.json中未找到type:${type} 对应的数据`)
}

console.info('开始创建构建所需变量文件...')

// 格式化数据
const outputData = Object.keys(typeData)
  .map(key => `${key}=${typeData[key]}`)
  .join(endOfLine)
const tips = `# 该文件通过vue-auto-env 工具自动生成，请勿直接修改，也不要使用git同步该文件！！！${endOfLine}`

// 写入数据
fs.writeFileSync(outputPath, tips + outputData)
