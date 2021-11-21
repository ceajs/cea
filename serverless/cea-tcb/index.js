exports.main = () => {
  // 导入 Cea 和内置的签到插件中的函数 checkIn
  const { default: Cea, checkIn, attendanceCheckIn } = require('cea')
  // 创建 Cea 的实例
  const cea = new Cea()
  // 注册插件
  cea.addPlugin(checkIn)
  cea.addPlugin(attendanceCheckIn)
  // 执行签到脚本
  cea.start()
}
