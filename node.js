module.exports = {
	env: {
		node: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
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
	plugins: ["@typescript-eslint", "import", "no-only-tests", "only-warn"],
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
			},
			exports: {},
		},
	},
	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"no-console": ["error", { allow: ["warn", "error"] }],
		"no-only-tests/no-only-tests": "error",
		"no-mixed-spaces-and-tabs": "off",
		"no-warning-comments": [
			"error",
			{ terms: ["fixme"], location: "anywhere" },
		],
	},
};
