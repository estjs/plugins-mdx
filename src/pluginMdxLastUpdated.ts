import { simpleGit } from 'simple-git';
import { now } from 'lodash-es';

import { MD_REGEX, cleanUrl } from './utils';
import type { Plugin } from 'vite';

export function pluginMdxGit(): Plugin {
  const cache = new Map<string, string>();
  const git = simpleGit();

  // https://github.com/steveukx/git-js#git-log
  async function getLastUpdatedTime(path: string) {
    try {
      const { latest } = await git.log({ file: path });
      return !latest ? '' : latest.date;
    } catch {
      return now();
    }
  }

  return <Plugin>{
    name: 'vite-plugin-mdx-last-update',
    async transform(code, id) {
      id = cleanUrl(id);
      if (!MD_REGEX.test(id)) return code;

      let lastUpdatedTime = '';
      if (cache.has(id)) {
        // Use cache to avoid unnecessary git command execution
        lastUpdatedTime = cache.get(id)!;
      } else {
        const rawTime = await getLastUpdatedTime(id);
        lastUpdatedTime = new Date(rawTime).toLocaleString('zh-CN');
        cache.set(id, lastUpdatedTime);
      }

      code = code.concat(`
        \n
export const lastUpdatedTime = "${lastUpdatedTime}"
      `);
      return code;
    },
  };
}
