exports.main = () => {
  // 导入 Cea 和内置的签到插件中的函数 checkIn
  const { default: Cea, checkIn, attendanceCheckIn } = require(
    // '../cea-cjs/lib/src/index',
    'cea',
  )
  // 创建 Cea 的实例
  const cea = new Cea()
  // 注册签到插件
  cea.addPlugin(checkIn)
  // 注册查寝插件，如需开启，请移除下行注释
  // cea.addPlugin(attendanceCheckIn)
  // 执行签到脚本
  cea.start()
}
