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
  t.regex(report, /line 2/, 'report contains text');
  t.regex(report, /char 3/, 'report contains text');
  t.regex(report, /Use of !important/, 'report contains text');
  t.regex(report, /1 warning/, 'report contains text');
});

test('should report with full path', t => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  let report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css'),
      { absoluteFilePathsForFormatters: true }) + reporter.endFormat();

  report = chalk.stripColor(report);

  const filename = report.split('\n')[1];

  t.true(filename === path.join(__dirname, 'style.css'), 'filename is correct');
  t.regex(report, /char 3/, 'report contains text');
  t.regex(report, /Use of !important/, 'report contains text');
  t.regex(report, /1 warning/, 'report contains text');
});

test('should be able to be registered as formatter', t => {
  t.false(CSSLint.hasFormat('stylish'), 'csslint should not be stylish');

  CSSLint.addFormatter(reporter);

  t.true(CSSLint.hasFormat('stylish'), 'csslint should be stylish');
});

test('should not report undefined output lines when no filename provided', t => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  let report = reporter.startFormat() + reporter.formatResults(res) + reporter.endFormat();

  report = chalk.stripColor(report);

  t.false(/^undefined$/gm.test(report), 'report should not contains undefined text output');
  // t.notRegex(report, /^undefined$/gm, 'report should not contains undefined text output');
});

test('should report filename provided', t => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename, { absoluteFilePathsForFormatters: true }) +
    reporter.endFormat();

  report = chalk.stripColor(report);

  // t.notRegex(report, /^undefined$/gm, 'report should not contains undefined text output');
  t.false(/^undefined$/gm.test(report), 'report should not contains undefined text output');
  t.true(report.split('\n')[1] === filename, 'filename should be in output lines');
});
