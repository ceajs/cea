exports.main = () => {
  // 导入 Cea 和内置的签到插件中的函数 checkIn
  const Cea, { checkIn } = require('cea')
  // 创建 Cea 的实例
  const cea = new Cea()
  // 注册插件
  cea.addPlugin(checkIn)
  // 执行签到脚本
  cea.start()
}
