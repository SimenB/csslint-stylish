/* eslint-env mocha */
/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true }] */

import { CSSLint } from 'csslint';
import chalk from 'chalk';

import path from 'path';
import assert from 'assert';

import reporter from './stylish';

describe('csslint-stylish', () => {
  it('should report stuff', () => {
    const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

    let report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css')) + reporter.endFormat();

    report = chalk.stripColor(report);

    const filename = report.split('\n')[1];

    assert(filename === 'style.css', 'filename is correct');
    assert(report.match(/line 2/), 'report contains text');
    assert(report.match(/char 3/), 'report contains text');
    assert(report.match(/Use of !important/), 'report contains text');
    assert(report.match(/1 warning/), 'report contains text');
  });

  it('should report with full path', () => {
    const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

    let report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css'),
        { absoluteFilePathsForFormatters: true }) + reporter.endFormat();

    report = chalk.stripColor(report);

    const filename = report.split('\n')[1];

    assert(filename === path.join(__dirname, 'style.css'), 'filename is correct');
    assert(report.match(/char 3/), 'report contains text');
    assert(report.match(/Use of !important/), 'report contains text');
    assert(report.match(/1 warning/), 'report contains text');
  });

  it('should be able to be registered as formatter', () => {
    assert(!CSSLint.hasFormat('stylish'), 'csslint should not be stylish');

    CSSLint.addFormatter(reporter);

    assert(CSSLint.hasFormat('stylish'), 'csslint should be stylish');
  });

  it('should not report undefined output lines when no filename provided', () => {
    const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

    let report = reporter.startFormat() + reporter.formatResults(res) + reporter.endFormat();

    report = chalk.stripColor(report);

    const matches = report.match(/^undefined$/gm);

    assert(matches === null, 'report should not contains undefined text output');
  });

  it('should report filename provided', () => {
    const res = CSSLint.verify('.class {\n  color: red !important\n}\n');
    const filename = path.resolve('filenamestyle.css');
    let report = reporter.startFormat() + reporter.formatResults(res, filename,
        { absoluteFilePathsForFormatters: true }) + reporter.endFormat();

    report = chalk.stripColor(report);

    const matches = report.match(/^undefined$/gm);
    const outfilename = report.split('\n')[1];

    assert(matches === null, 'report should not contains undefined text output');
    assert(outfilename === filename, 'filename should be in output lines');
  });
});
