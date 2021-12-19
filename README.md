# vue-auto-env

## 配置（在项目中配置即可）

> json 配置和 js 配置二选一，根据实际需求配置即可。

1. 项目根目录创建`env.json`文件
2. JSON 配置参考，相比 js 配置更清晰，根据类型可以看到项目的环境变量配置:

```json
{
  "dev": {
    "LOGIN_ENV": "dev"
  },
  "fz": {
    "LOGIN_ENV": "fz"
  },
  "prod": {
    "LOGIN_ENV": "prod"
  }
}
```

3. js 配置参考，相比 json 配置更灵活，可以动态的根据 type 来生成所需的环境变量

```js
module.exports = type => {
  return {
    LOGIN_ENV: type
  }
}
```

4. 默认值为`prod`,切记根据使用环境自行设置

```json
{
  "scripts": {
    "build": "vue-auto-env && vue-cli-service build" // env:prod
  }
}
```

## 使用

1. 项目内安装：`npm i vue-auto-env -D`
2. 启动项目的时候: `vue-auto-env dev && vue-cli-service serve`
3. 构建项目: `vue-auto-env prod && npm run build`
4. 配合 npm scripts 使用, 然后执行 `npm run build --envtype prod`:

```json
{
  "scripts": {
    "build": "vue-auto-env && vue-cli-service build"
  }
}
```

## 变量规则

1. 如果需要在 web 项目中通过 process.env 来调用，一定要添加 VUE*APP*前缀。
2. 如果没有前缀，只能在构建工具内使用。[详情](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E7%A4%BA%E4%BE%8B%EF%BC%9Astaging-%E6%A8%A1%E5%BC%8F)

## 实现原理

1. 该命令读取项目根目录的 env.json 配置，根据传入的类型，生成临时的.env.local 文件。
2. vue cli3 读取 env.local 文件，从而实现环境变量的加载[源码](https://github.com/vuejs/vue-cli/blob/bd57f15a15303d7ae32eb4961d9418b76593189c/packages/%40vue/cli-service/lib/Service.js#L92)

## 需求背景

1. 由于 vue cli 中不同的模式需要独立的配置文件，而且各个独立配置文件，没法公用部分配置，比如 dev 和 fz 环境下的部分相同配置。所以该工具支持 env.js 来动态生成配置数据。
2. 由于 vue cli 中如果对应的 mode 不存在，也并不会报错和提示。这样的话给项目开发会带来未知的 bug。所以该工具如果匹配不到对应 type，直接报错退出。

## api

1. `getEnvFromNpmArgv`从 npm 脚本中读取 env 类型
