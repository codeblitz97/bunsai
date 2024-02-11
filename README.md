<p align="center">
<img src="./assets/logo.jpeg" width="200px" height="200px">
</p>

<h1 align="center">BonSai</h1>

> Japanese art of growing and shaping miniature trees in containers

## Quick start

BonSai is a zero dependency library/framework (in fact, it has Nunjucks and Sass as optional dependencies). You can install it:

```sh
bun add bonsai
```

And use it as a handler:

```js
import BonSai from "bonsai";

const { fetch } = BonSai({
  /*
    "loaders" is the only required property, as it configures BonSai's behavior
  */
  loaders,
});

Bun.serve({
  fetch,
});
```

## How it works?

Powered by [`Bun.FileSystemRouter`](https://bun.sh/docs/api/file-system-router) and some fancy tricks, BonSai takes an approach where you declare the files you want to become "routes"

```js
loaders: {
  ".ext": loader
}
```

And all files with that file extension will be served as routes.

### Example

Lets say you have the following files:

```txt
pages
├── index.njk
├── settings.tsx
├── blog
│   ├── [slug].svelte
│   └── index.ts
└── [[...catchall]].vue
```

You can configure BonSai to serve those files:

```js
BonSai({
  loaders: {
    ".njk": nunjucksLoader,
    ".ts": apiLoader,
    ".tsx": reactLoader,
    ".svelte": svelteLoader,
    ".vue": vueLoader,
  },
});
```

> Check the [`Loader`](./types.ts#L5) interface

You can also specify file extensions that will be served staticly (`return new Response(Bun.file(filePath))`), like so:

```js
staticFiles: [".jpg", ".css", ".aac"];
```

> There is a caveat around `staticFiles`: as all files are served using the FileSystemRouter, `pages/pic.jpeg` will be served as `/pic`

## Built-in loaders

BonSai is 100% flexible, but this does not mean that it cannot be opinionated. BonSai ships with built-in (optional) loaders:

### [Nunjucks](https://mozilla.github.io/nunjucks/)

Nunjucks is a rich powerful templating language with block inheritance, autoescaping, macros, asynchronous control, and more. Heavily inspired by jinja2.

```sh
bun add nunjucks @types/nunjucks
```

```js
import getNunjucksLoader from "bonsai/loaders/nunjucks";

const { loader, env } =
  getNunjucksLoader(/* (optional) root path and nunjucks configure options */);

// you can make changes on the nunjucks Environment object (the 'env' object).
// See https://mozilla.github.io/nunjucks/api.html#environment

BonSai({
  loaders: {
    ".njk": loader,
  },
});
```

```html
<body>
  {# 'server', 'route' and 'request' #}

  <p>
    All those objects are passed to the Nunjucks renderer to be available
    globally
  </p>
</body>
```

### [Sass](https://sass-lang.com/)

Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.

```sh
bun add sass @types/sass
```

```js
import getSassLoader from "bonsai/loaders/sass";

const loader = getSassLoader(/* (optional) sass compiler options */);

BonSai({
  loaders: {
    ".scss": loader,
  },
});
```

### Module

BonSai offers a simple module implementation to handle `.ts`, `.tsx`, `.js` and `.node` files:

```js
import { ModuleLoader } from "bonsai/loaders";

BonSai({
  loaders: {
    ".ts": ModuleLoader,
  },
});
```

A server module is a regular TS/TSX/JS/NAPI (anything that Bun can import) file that have the following structure:

```ts
// optional
export const headers = {
  // All reponse headers go here.
  // The default Content-Type header is "text/html; charset=utf-8", but you can override it.
};

// required
export function handler(data: ModuleData) {
  // data.server => Server
  // data.route => MatchedRoute
  // data.request => Request
  // The handler must return a BodyInit or an instance of Response, whether synchronously or asynchronously.
  // If Response is returned, the loader will send it and the "headers" export will be ignored.
}
```

### Recommended

If you liked BonSai's opinion and want to enjoy all this beauty, you can use the recommended configuration:

```js
import getRecommended from "bonsai/recommended";

const { loaders, staticFiles, nunjucksEnv } =
  getRecommended(/* (optional) nunjucks and sass options */);

BonSai({
  loaders,
  staticFiles,
});
```

> Check the [`Recommended`](./types.ts#L67) interface.