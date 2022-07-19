# @cyco130/eslint-config

This is a set of reusable ESLint configurations for [Fatih Aygün](https://github.com/cyco130)'s personal projects.

## Usage

Install with `pnpm install -D @cyco130/eslint-config` and create a `.eslintrc.cjs` file with the following content:

```js
require("@cyco130/eslint-config/patch");

module.exports = {
	root: true,
	extends: ["@cyco130/eslint-config/node"], // or react instead of node
	parserOptions: { tsconfigRootDir: __dirname },
	settings: {
		"import/resolver": {
			typescript: {
				project: [__dirname + "/tsconfig.json"],
			},
		},
	},
};
```

## Credits and license

-   By Fatih Aygün, [MIT license](./LICENSE)
