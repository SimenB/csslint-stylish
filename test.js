/* eslint-env mocha */

import reporter from './stylish'

import { CSSLint } from 'csslint'
import chalk from 'chalk'

import path from 'path'
import assert from 'assert'

describe('csslint-stylish', () => {
  it('should report stuff', () => {
    const res = CSSLint.verify('.class {\n  color: red !important\n}\n')

    let report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css')) + reporter.endFormat()

    report = chalk.stripColor(report)

    const filename = report.split('\n')[1]

    assert(filename === 'style.css', 'filename is correct')
    assert(report.match(/line 2/), 'report contains text')
    assert(report.match(/char 3/), 'report contains text')
    assert(report.match(/Use of !important/), 'report contains text')
    assert(report.match(/1 warning/), 'report contains text')
  })

  it('should report with full path', () => {
    const res = CSSLint.verify('.class {\n  color: red !important\n}\n')

    let report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css'),
        {absoluteFilePathsForFormatters: true}) + reporter.endFormat()

    report = chalk.stripColor(report)

    const filename = report.split('\n')[1]

    assert(filename === path.join(__dirname, 'style.css'), 'filename is correct')
    assert(report.match(/char 3/), 'report contains text')
    assert(report.match(/Use of !important/), 'report contains text')
    assert(report.match(/1 warning/), 'report contains text')
  })

  it('should be able to be registered as formatter', () => {
    assert(!CSSLint.hasFormat('stylish'), 'csslint should not be stylish')

    CSSLint.addFormatter(reporter)

    assert(CSSLint.hasFormat('stylish'), 'csslint should be stylish')
  })
})
