import { upperFirst, camelCase } from 'lodash'
const regGlobalComponent = {
  install: Vue => {
    const requireComponent = require.context(
      // 其组件目录的相对路径
      '../components/global/',
      // 是否查询其子目录
      true,
      // 匹配基础组件文件名的正则表达式
      /_base\.vue$/
    )

    requireComponent.keys().forEach(fileName => {
      // 获取组件配置
      const componentConfig = requireComponent(fileName)
      // 获取组件名，并对其进行大驼峰格式化
      try {
        const componentName = upperFirst(camelCase(componentConfig.default.name))
        // 全局注册组件
        Vue.component(componentName, componentConfig.default || componentConfig)
      } catch (e) {
        console.error('全局组件注册失败：', e)
      }
    })
  }
}

export default regGlobalComponent
