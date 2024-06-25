import process from 'node:process';
export const isProduction = () => process.env.NODE_ENV === 'production';

export const DIRECTIVE_TYPES: string[] = ['tip', 'warning', 'danger', 'info'];
export const MD_REGEX = /\.mdx?$/;

export const queryRE = /\?.*$/s;
export const hashRE = /#.*$/s;

export const cleanUrl = (url: string): string => url.replace(hashRE, '').replace(queryRE, '');

export const TARGET_BLANK_WHITE_LIST = [
  'https://essor.netlify.app/',
  'https://essor-playground.netlify.app/',
  'https://essor-router.netlify.app/',
];

export const LANGS = [
  'javascript',
  'vue',
  'typescript',
  'css',
  'sass',
  'less',
  'stylus',
  'scss',
  'jsonc',
  'yaml',
  'html',
  'json',
  'markdown',
  'shell',
  'bash',
  'sql',
  'python',
  'java',
  'c',
  'c++',
  'c#',
  'go',
  'kotlin',
  'php',
  'swift',
  'rust',
];
