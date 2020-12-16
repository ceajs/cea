const chalk = require('chalk')
const { inspect } = require('util')

module.exports = {
  error(s) {
    console.log(chalk.bgRed(s))
  },
  warning(s) {
    console.log(chalk.yellow(s))
  },
  success(s) {
    console.log(chalk.bgCyan(s))
  },
  object(s) {
    console.log(chalk.cyan(inspect(s)))
  },
}
