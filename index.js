'use strict';

var path = require('path');

var chalk = require('chalk');
var table = require('text-table');
var logSymbols = require('log-symbols');
var pluralize = require('pluralize');

module.exports = {
  id: 'stylish',
  name: 'CSSLint Stylish format',

  totalErrors: 0,
  totalWarnings: 0,

  startFormat: function () {
    this.totalErrors = 0;
    this.totalWarnings = 0;

    return '';
  },

  endFormat: function () {
    var totalViolations = this.totalErrors + this.totalWarnings,
      output = '\n';

    if (totalViolations === 0) {
      output += 'No violations';
    }

    if (this.totalErrors > 0) {
      output += '    ' + logSymbols.error + '  ' + pluralize('error', this.totalErrors, true) + '\n';
    }

    if (this.totalWarnings > 0) {
      output += '    ' + logSymbols.warning + '  ' + pluralize('warning', this.totalWarnings, true) + '\n';
    }

    return output;
  },

  formatResults: function (results, filename, options) {
    var messages = results.messages,
      output = [],
      self = this,
      usableOptions = options || {};

    if (messages.length > 0) {
      if (filename) {
        if (usableOptions.absoluteFilePathsForFormatters) {
          output.push([ chalk.underline(filename) + '\n' ]);
        } else {
          var relateFilename = path.relative(process.cwd(), filename);

          output.push([ chalk.underline(relateFilename) + '\n' ]);
        }
      }

      messages.forEach(function (message) {
        var line = [ '' ];
        var isWarning = message.type === 'warning';

        if (isWarning) {
          self.totalWarnings++;
        } else {
          self.totalErrors++;
        }

        if (message.rollup) {
          line.push('');
          line.push('');
        } else {
          line.push(chalk.gray('line ' + message.line));
          line.push(chalk.gray('char ' + message.col));
        }

        line.push(isWarning ? (process.platform === 'win32' ? chalk.cyan(message.message) :
          chalk.blue(message.message)) : chalk.red(message.message));

        output.push(line);
      });

      output.push([ '\n\n' ]);
    }

    return table(output);
  }
};
