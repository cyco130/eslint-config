# @cyco130/eslint-config

This is a set of reusable ESLint configurations for [Fatih Aygün](https://github.com/cyco130)'s personal projects.

## Compatibility

Version 5 and later only supports ESLint 9 and flat configs. Use version 4.x.x for ESLint 8 and legacy configs.

## Usage

Install with `pnpm install -D @cyco130/eslint-config` and create a file named `eslint.config.js` (or `.mjs` if you don't have `"type": "module"` in your `package.json`) with the following content:

```js
import config from "@cyco130/eslint-config/node"; // or "@cyco130/eslint-config/react"

/** @type {typeof config} */
export default [
	...config,
	{
		// Add your own ignores here
		ignores: ["dist/", "node_modules/"],
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				// @ts-expect-error: remove this directive if you have Node type definitions in your project
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
```

## Credits and license

-   By Fatih Aygün, [MIT license](./LICENSE)
