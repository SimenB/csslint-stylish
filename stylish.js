import path from 'path';

import chalk from 'chalk';
import table from 'text-table';
import logSymbols from 'log-symbols';

export default {
  id: 'stylish',
  name: 'CSSLint Stylish format',

  totalErrors: 0,
  totalWarnings: 0,

  startFormat() {
    this.totalErrors = 0;
    this.totalWarnings = 0;

    return '';
  },

  endFormat() {
    const { totalErrors, totalWarnings } = this;
    const totalViolations = totalErrors + totalWarnings;
    let output = '\n\n';

    if (totalViolations === 0) {
      return '\nNo violations';
    }

    if (totalErrors > 0) {
      output += `    ${logSymbols.error}  ${totalErrors} ${totalErrors > 1 ? 'errors' : 'error'}\n`;
    }

    if (totalWarnings > 0) {
      output += `    ${logSymbols.warning}  ${totalWarnings} ${totalWarnings > 1 ? 'warnings' : 'warning'}\n`;
    }

    return output;
  },

  formatResults({ messages }, filename, { absoluteFilePathsForFormatters } = {}) {
    let output = [];
    let underlinedFilename;

    if (messages.length > 0) {
      if (filename) {
        if (absoluteFilePathsForFormatters) {
          underlinedFilename = chalk.underline(filename);
        } else {
          const relateFilename = path.relative(process.cwd(), filename);

          underlinedFilename = chalk.underline(relateFilename);
        }
      }

      output = messages.map(({ message, rollup, line, col, type }) => {
        const formatted = [''];
        const isWarning = type === 'warning';

        if (isWarning) {
          this.totalWarnings++;
        } else {
          this.totalErrors++;
        }

        if (rollup) {
          formatted.push('');
          formatted.push('');
        } else {
          formatted.push(chalk.gray(`line ${line}`));
          formatted.push(chalk.gray(`char ${col}`));
        }

        formatted.push(isWarning ? chalk.yellow(message) : chalk.red(message));

        return formatted;
      });
    }

    if (underlinedFilename) {
      return `\n${underlinedFilename}\n${table(output)}`;
    }
    return `\n${table(output)}`;
  },
};
