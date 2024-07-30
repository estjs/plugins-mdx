# plugins-mdx

[![NPM version](https://img.shields.io/npm/v/plugins-mdx?color=a1b858&label=)](https://www.npmjs.com/package/plugins-mdx)

### A mdx plugin collection for plugins

```warn
just support vite
```

## Install

```bash
npm i -D plugins-mdx
```

## Usage

```js
import { defineConfig } from 'vite'
import mdx from 'plugins-mdx'

export default defineConfig({
  plugins: [
    mdx()
  ]
})
```

## Options

```ts
export interface options {
  /**
   * root path
   */
  root: string;
  /**
   * Base path of the site.
   */
  base: string;
  /**
   * Enable single page application in production.
   */
  enableSpa?: boolean;
  /**
   * Whether to fail builds when there are dead links.
   */
  allowDeadLinks?: boolean;
  /**
   * vite plugin array
   */
  plugins: Plugin[];
}
```
