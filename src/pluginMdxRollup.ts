import pluginMdx from '@mdx-js/rollup';
import remarkPluginGFM from 'remark-gfm';
import remarkPluginFrontMatter from 'remark-frontmatter';
import remarkDirective from 'remark-directive';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkGemoji from 'remark-gemoji';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';
import rehypePluginExternalLinks from 'rehype-external-links';
import { getSingletonHighlighter } from 'shiki';
import { remarkPluginToc } from './remarkPlugins/toc';
import { remarkPluginTip } from './remarkPlugins/tip';
import { rehypePluginShiki } from './rehypePlugins/shiki';
import { remarkPluginNormalizeLink } from './remarkPlugins/link';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';
import { LANGS, TARGET_BLANK_WHITE_LIST } from './utils';
import type { options } from './types';
import type { Plugin } from 'vite';

export async function pluginMdxRollup(config: options): Promise<Plugin> {
  config = config || {};
  return pluginMdx({
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
          target: node => {
            const href = node.properties?.href;
            const whiteList = [...TARGET_BLANK_WHITE_LIST];
            if (typeof href === 'string') {
              const inWhiteList = whiteList.some(item => {
                if (item instanceof RegExp) return item.test(href);
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
          highlighter: await getSingletonHighlighter({
            themes: ['dark-plus'],
            langs: LANGS,
          }),
        },
      ],
    ],
  }) as unknown as Plugin;
}
