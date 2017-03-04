/* eslint-env jest */

import { CSSLint } from 'csslint';
import chalk from 'chalk';

import path from 'path';

import reporter from './stylish';

test('should report stuff', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  const report = reporter.startFormat() + reporter.formatResults(res, path.resolve('style.css')) + reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});

test('should report with full path', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  const report = reporter.startFormat() +
    reporter.formatResults(res, path.resolve('style.css'), { absoluteFilePathsForFormatters: true }) +
    reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});

test('should be able to be registered as formatter', () => {
  expect(CSSLint.hasFormat('stylish')).toEqual(false);

  CSSLint.addFormatter(reporter);

  expect(CSSLint.hasFormat('stylish')).toEqual(true);
});

test('should not report undefined output lines when no filename provided', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');

  const report = reporter.startFormat() + reporter.formatResults(res) + reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});

test('should report filename provided', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n');
  const filename = path.resolve('filenamestyle.css');
  const report = reporter.startFormat() +
    reporter.formatResults(res, filename, { absoluteFilePathsForFormatters: true }) +
    reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});

test('should report no violations if there are none', () => {
  const res = CSSLint.verify('.class {\n  color: red;\n}\n');
  const filename = path.resolve('filenamestyle.css');
  const report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});

test('should report errors', () => {
  const res = CSSLint.verify('.class {\n  color: red !important\n}\n', { important: 2 });
  const filename = path.resolve('filenamestyle.css');
  const report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});

test('should report multiple warnings', () => {
  const res = CSSLint.verify('.class {\n  color: red !important;\ntext-size: 12px !important;\n}\n', { important: 1 });
  const filename = path.resolve('filenamestyle.css');
  const report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});

test('should report multiple errors', () => {
  const res = CSSLint.verify('.class {\n  color: red !important;\ntext-size: 12px !important;\n}\n', { important: 2 });
  const filename = path.resolve('filenamestyle.css');
  const report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});

test('should report rollups correctly', () => {
  const res = CSSLint.verify(
    '.class {\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;' +
      '\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n  float: left;\n}\n',
    { floats: 2 }
  );
  const filename = path.resolve('filenamestyle.css');
  const report = reporter.startFormat() + reporter.formatResults(res, filename) + reporter.endFormat();

  expect(chalk.stripColor(report)).toMatchSnapshot();
});
