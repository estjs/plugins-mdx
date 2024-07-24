import pluginMdx from '@mdx-js/rollup';
import remarkPluginGFM from 'remark-gfm';
import remarkPluginFrontMatter from 'remark-frontmatter';
import remarkDirective from 'remark-directive';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkGemoji from 'remark-gemoji';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';
import rehypePluginExternalLinks from 'rehype-external-links';
import { bundledLanguages, createHighlighter } from 'shiki';
import { remarkPluginToc } from './remarkPlugins/toc';
import { remarkPluginTip } from './remarkPlugins/tip';
import { rehypePluginShiki } from './rehypePlugins/shiki';
import { remarkPluginNormalizeLink } from './remarkPlugins/link';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';
import { TARGET_BLANK_WHITE_LIST, isReg } from './utils';
import type { options } from './types';
import type { Plugin } from 'vite';

async function getShikiHighlighter() {
  const highlighter = await createHighlighter({
    themes: ['dark-plus'],
    langs: Object.keys(bundledLanguages),
  });
  return highlighter;
}
export const mdxPluginsConfig = async (config: options): Promise<any> => ({
  elementAttributeNameCase: 'html',
  jsx: true,
  remarkPlugins: [
    remarkPluginGFM,
    // The following two plugin for frontmatter
    remarkPluginFrontMatter,
    [remarkPluginMDXFrontMatter, { name: 'frontmatter' }],
    remarkGemoji,
    remarkPluginToc,
    remarkDirective,
    remarkPluginTip,
    [remarkPluginNormalizeLink, { base: config.base || '/', enableSpa: config.enableSpa }],
  ],
  rehypePlugins: [
    rehypePluginSlug,
    [
      rehypePluginAutolinkHeadings,
      {
        properties: {
          class: 'header-anchor',
          ariaHidden: 'true',
        },
        content: {
          type: 'text',
          value: '#',
        },
      },
    ],
    [
      // Open new window then click external link
      rehypePluginExternalLinks,
      {
        target: (node: any) => {
          const href = node.properties?.href;
          const whiteList = [...TARGET_BLANK_WHITE_LIST];
          if (typeof href === 'string') {
            const inWhiteList = whiteList.some(item => {
              if (isReg(item)) return item.test(href);
              else return href.startsWith(item);
            });
            return inWhiteList ? '_self' : '_blank';
          }
        },
      },
    ],
    rehypePluginPreWrapper,
    [
      rehypePluginShiki,
      {
        highlighter: await getShikiHighlighter(),
      },
    ],
  ],
});

export async function pluginMdxRollup(config: options): Promise<Plugin> {
  config = config || {};
  return pluginMdx(await mdxPluginsConfig(config)) as unknown as Plugin;
}
