# @cyco130/eslint-config

This is a set of reusable ESLint configurations for [Fatih Aygün](https://github.com/cyco130)'s personal projects.

## Usage

Install with `pnpm install -D @cyco130/eslint-config` and then add the following to your `.eslintrc.js`:

```js
require("@cyco130/eslint-config/patch");

module.exports = {
	extends: [ "@cyco130/eslint-config/node" ], // or "@cyco130/eslint-config/react"
	parserOptions: { tsconfigRootDir: __dirname }
};
```
