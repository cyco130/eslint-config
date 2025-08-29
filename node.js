// @ts-check
import { builtinModules } from "node:module";
import eslint from "@eslint/js";
import { configs as tsEslintCfg, config } from "typescript-eslint";
import { flatConfigs as importCfg } from "eslint-plugin-import-x";
import prettierCfg from "eslint-config-prettier";
import noOnlyTests from "eslint-plugin-no-only-tests";
import globals from "globals";
import "eslint-plugin-only-warn";

export default config(
	eslint.configs.recommended,
	tsEslintCfg.recommended,
	importCfg.recommended,
	importCfg.typescript,
	prettierCfg,
	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
		plugins: {
			"no-only-tests": noOnlyTests,
		},
		languageOptions: {
			globals: {
				...globals.es2021,
				...globals.node,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		settings: {
			"import-x/parsers": {
				"@typescript-eslint/parser": [".ts", ".tsx"],
			},
			"import-x/resolver": {
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

			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-deprecated": "error",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "error",
			"@typescript-eslint/no-non-null-assertion": "off",

			"import-x/default": "off",
			"import-x/no-unresolved": "off",
			"import-x/no-named-as-default": "off",
			"import-x/no-named-as-default-member": "off",
			"import-x/no-nodejs-modules": [
				"error",
				{ allow: builtinModules.map((mod) => `node:${mod}`) },
			],
		},
	}
);
