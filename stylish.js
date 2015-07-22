import path from 'path'

import chalk from 'chalk'
import table from 'text-table'
import logSymbols from 'log-symbols'
import pluralize from 'pluralize'

export default {
  id: 'stylish',
  name: 'CSSLint Stylish format',

  totalErrors: 0,
  totalWarnings: 0,

  startFormat: function () {
    this.totalErrors = 0
    this.totalWarnings = 0

    return ''
  },

  endFormat: function () {
    const totalViolations = this.totalErrors + this.totalWarnings
    let output = '\n'

    if (totalViolations === 0) {
      output += 'No violations'
    }

    if (this.totalErrors > 0) {
      output += `    ${logSymbols.error}  ${pluralize('error', this.totalErrors, true)}\n`
    }

    if (this.totalWarnings > 0) {
      output += `    ${logSymbols.warning}  ${pluralize('warning', this.totalWarnings, true)}\n`
    }

    return output
  },

  formatResults: function (results, filename, options) {
    const {messages} = results
    let output = []
    const {absoluteFilePathsForFormatters} = (options || {})

    if (messages.length > 0) {
      if (filename) {
        if (absoluteFilePathsForFormatters) {
          output.push([chalk.underline(filename) + '\n'])
        } else {
          const relateFilename = path.relative(process.cwd(), filename)

          output.push([chalk.underline(relateFilename) + '\n'])
        }
      }

      messages.forEach(origMessage => {
        const { message, rollup, line, col, type } = origMessage
        const formatted = ['']
        const isWarning = type === 'warning'

        if (isWarning) {
          this.totalWarnings++
        } else {
          this.totalErrors++
        }

        if (rollup) {
          formatted.push('')
          formatted.push('')
        } else {
          formatted.push(chalk.gray(`line ${line}`))
          formatted.push(chalk.gray(`char ${col}`))
        }

        formatted.push(isWarning ?
          (process.platform === 'win32' ? chalk.cyan(message) : chalk.blue(message)) :
          chalk.red(message))

        output.push(formatted)
      })

      output.push(['\n\n'])
    }

    return table(output)
  }
}
