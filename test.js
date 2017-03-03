/* eslint-env jest */

import { CSSLint } from 'csslint';
import chalk from 'chalk';

import path from 'path';

import reporter from './stylish';

test('should report stuff', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  let report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css')) + reporter.endFormat();

  report = chalk.stripColor(report);

  const filename = report.split('\n')[1];

  expect(filename).toEqual('style.css', 'filename is correct');
  expect(report).toMatch(/line 2/);
  expect(report).toMatch(/char 3/);
  expect(report).toMatch(/Use of !important/);
  expect(report).toMatch(/1 warning/);
});

test('should report with full path', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  let report = reporter.startFormat() +
    reporter.formatResults(res, path.resolve('style.css'), { absoluteFilePathsForFormatters: true }) +
    reporter.endFormat();

  report = chalk.stripColor(report);

  const filename = report.split('\n')[1];

  expect(filename).toEqual(path.join(__dirname, 'style.css'), 'filename is correct');
  expect(report).toMatch(/char 3/);
  expect(report).toMatch(/Use of !important/);
  expect(report).toMatch(/1 warning/);
});

test('should be able to be registered as formatter', () => {
  expect(CSSLint.hasFormat('stylish')).toEqual(false);

  CSSLint.addFormatter(reporter);

  expect(CSSLint.hasFormat('stylish')).toEqual(true);
});

test('should not report undefined output lines when no filename provided', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  let report = reporter.startFormat() + reporter.formatResults(res) + reporter.endFormat();

  report = chalk.stripColor(report);

  expect(report).not.toMatch(/^undefined$/gm);
});

test('should report filename provided', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() +
    reporter.formatResults(res, filename, { absoluteFilePathsForFormatters: true }) +
    reporter.endFormat();

  report = chalk.stripColor(report);

  expect(report).not.toMatch(/^undefined$/gm);
  expect(report.split('\n')[1]).toEqual(filename, 'filename should be in output lines');
});

test('should report no violations if there are none', () => {
  const res = CSSLint.verify('.class {\n  color: red;\n}\n');
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  expect(report.trim()).toEqual('No violations');
});

test('should report errors', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n', { important: 2 });
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  expect(report).toMatch(/line 2/);
  expect(report).toMatch(/char 3/);
  expect(report).toMatch(/Use of !important/);
  expect(report).toMatch(/1 error/);
});

test('should report multiple warnings', () => {
  const res = CSSLint.verify('.class {\n  color: red !important;\ntext-size: 12px !important;\n}\n', { important: 1 });
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  expect(report).toMatch(/2 warnings/);
});

test('should report multiple errors', () => {
  const res = CSSLint.verify('.class {\n  color: red !important;\ntext-size: 12px !important;\n}\n', { important: 2 });
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  expect(report).toMatch(/2 errors/);
});

test('should report rollups correctly', () => {
  const res = CSSLint.verify(
    '.class {\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;' +
      '\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n}\n',
    { floats: 2 }
  );
  const filename = path.resolve('filenamestyle.css');
  let report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  report = chalk.stripColor(report);

  expect(report).not.toMatch(/line /);
  expect(report).not.toMatch(/char /);
  expect(report).toMatch(/Too many floats \(11\), you're probably using them for layout. Consider using a grid system instead\./);
  expect(report).toMatch(/1 warning/);
});
