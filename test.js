/* eslint-env mocha */

'use strict'

var reporter = require('./')

var csslint = require('csslint').CSSLint
var chalk = require('chalk')

var path = require('path')
var assert = require('assert')

describe('csslint-stylish', function () {
  it('should report stuff', function () {
    var res = csslint.verify('.class {\n  color: red !important\n}\n')

    var report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css')) + reporter.endFormat()

    report = chalk.stripColor(report)

    var filename = report.split('\n')[ 0 ]

    assert(filename === 'style.css', 'filename is correct')
    assert(report.match(/line 2/), 'report contains text')
    assert(report.match(/char 3/), 'report contains text')
    assert(report.match(/Use of !important/), 'report contains text')
    assert(report.match(/1 warning/), 'report contains text')
  })

  it('should report with full path', function () {
    var res = csslint.verify('.class {\n  color: red !important\n}\n')

    var report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css'),
        { absoluteFilePathsForFormatters: true }) + reporter.endFormat()

    report = chalk.stripColor(report)

    var filename = report.split('\n')[ 0 ]

    assert(filename === path.join(__dirname, 'style.css'), 'filename is correct')
    assert(report.match(/char 3/), 'report contains text')
    assert(report.match(/Use of !important/), 'report contains text')
    assert(report.match(/1 warning/), 'report contains text')
  })

  it('should be able to be registered as formatter', function () {
    assert(!csslint.hasFormat('stylish'), 'csslint should not be stylish')

    csslint.addFormatter(reporter)

    assert(csslint.hasFormat('stylish'), 'csslint should be stylish')
  })
})
