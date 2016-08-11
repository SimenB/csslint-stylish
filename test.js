/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true }] */

import test from 'ava';
import { CSSLint } from 'csslint';
import chalk from 'chalk';

import path from 'path';

import reporter from './stylish';

test('should report stuff', t => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  let report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css')) + reporter.endFormat();

  report = chalk.stripColor(report);

  const filename = report.split('\n')[1];

  t.true(filename === 'style.css', 'filename is correct');
  t.true(/line 2/.test(report), 'report contains text');
  t.true(/char 3/.test(report), 'report contains text');
  t.true(/Use of !important/.test(report), 'report contains text');
  t.true(/1 warning/.test(report), 'report contains text');
});

test('should report with full path', t => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  let report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css'),
      { absoluteFilePathsForFormatters: true }) + reporter.endFormat();

  report = chalk.stripColor(report);

  const filename = report.split('\n')[1];

  t.true(filename === path.join(__dirname, 'style.css'), 'filename is correct');
  t.true(/char 3/.test(report), 'report contains text');
  t.true(/Use of !important/.test(report), 'report contains text');
  t.true(/1 warning/.test(report), 'report contains text');
});

test('should be able to be registered as formatter', t => {
  t.true(!CSSLint.hasFormat('stylish'), 'csslint should not be stylish');

  CSSLint.addFormatter(reporter);

  t.true(CSSLint.hasFormat('stylish'), 'csslint should be stylish');
});

test('should not report undefined output lines when no filename provided', t => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  let report = reporter.startFormat() + reporter.formatResults(res) + reporter.endFormat();

  report = chalk.stripColor(report);

  t.true(!/^undefined$/gm.test(report), 'report should not contains undefined text output');
});

test('should report filename provided', t => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename, { absoluteFilePathsForFormatters: true }) +
    reporter.endFormat();

  report = chalk.stripColor(report);

  t.true(!/^undefined$/gm.test(report), 'report should not contains undefined text output');
  t.true(report.split('\n')[1] === filename, 'filename should be in output lines');
});

test('should report no violations if there are none', t => {
  const res = CSSLint.verify('.class {\n  color: red;\n}\n');
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  t.true(report.trim() === 'No violations', 'report contains text');
});

test('should report errors', t => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n', { important: 2 });
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  t.true(/line 2/.test(report), 'report contains text');
  t.true(/char 3/.test(report), 'report contains text');
  t.true(/Use of !important/.test(report), 'report contains text');
  t.true(/1 error/.test(report), 'report contains text');
});

test('should report multiple warnings', t => {
  const res = CSSLint.verify('.class {\n  color: red !important;\ntext-size: 12px !important;\n}\n', { important: 1 });
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  t.true(/2 warnings/.test(report), 'report contains text');
});

test('should report multiple errors', t => {
  const res = CSSLint.verify('.class {\n  color: red !important;\ntext-size: 12px !important;\n}\n', { important: 2 });
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  t.true(/2 errors/.test(report), 'report contains text');
});

test('should report rollups correctly', t => {
  const res = CSSLint.verify('.class {\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;' +
    '\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n}\n', { floats: 2 });
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  t.true(!/line /.test(report), 'report does not contains text');
  t.true(!/char /.test(report), 'report does not contains text');
  t.true(/Too many floats \(11\), you're probably using them for layout. Consider using a grid system instead\./.test(report),
    'report contains text');
  t.true(/1 warning/.test(report), 'report contains text');
});
