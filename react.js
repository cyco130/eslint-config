const { builtinModules } = require("node:module");

module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:react/recommended",
		"plugin:ssr-friendly/recommended",
		"plugin:css-modules/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: [
		"@typescript-eslint",
		"css-modules",
		"import",
		"no-only-tests",
		"only-warn",
		"react",
		"react-hooks",
		"ssr-friendly",
	],
	settings: {
		react: {
			version: "18",
		},
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
	rules: {
		"no-console": ["error", { allow: ["warn", "error"] }],
		"no-only-tests/no-only-tests": "error",
		"no-mixed-spaces-and-tabs": "off",
		"no-warning-comments": [
			"error",
			{ terms: ["fixme"], location: "anywhere" },
		],

		"@typescript-eslint/deprecation": "error",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-empty-object-type": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-floating-promises": "error",
		"@typescript-eslint/no-non-null-assertion": "off",

		"import/default": "off",
		"import/no-unresolved": "off",
		"import/no-named-as-default": "off",
		"import/no-named-as-default-member": "off",
		"import/no-nodejs-modules": [
			"error",
			{ allow: builtinModules.map((mod) => `node:${mod}`) },
		],

		"react/prop-types": "off",
		"react/react-in-jsx-scope": "off",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "error",
	},
};
