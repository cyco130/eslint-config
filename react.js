// @ts-check
import { builtinModules } from "node:module";
import eslint from "@eslint/js";
import { configs as tsEslintCfg, config } from "typescript-eslint";
import { flatConfigs as importCfg } from "eslint-plugin-import-x";
import prettierCfg from "eslint-config-prettier";
import noOnlyTests from "eslint-plugin-no-only-tests";
import "eslint-plugin-only-warn";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import ssr from "eslint-plugin-ssr-friendly";
import * as cssModules from "eslint-plugin-css-modules";
import globals from "globals";
import { fixupPluginRules } from "@eslint/compat";

/** @type { { rules: Record<string, 2>} } */
// @ts-expect-error
const cssModulesRecommendedConfig = cssModules.configs.recommended;

export default config(
	eslint.configs.recommended,
	tsEslintCfg.recommended,
	importCfg.recommended,
	importCfg.typescript,
	react.configs.flat.recommended,
	react.configs.flat["jsx-runtime"],
	cssModulesRecommendedConfig,
	prettierCfg,
	{
		plugins: {
			"no-only-tests": noOnlyTests,
			"react-hooks": hooks,
			// @ts-expect-error
			"ssr-friendly": fixupPluginRules(ssr),
			"css-modules": cssModules,
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
			react: {
				version: "detect",
			},
		},
		rules: {
			...hooks.configs.recommended.rules,
			...ssr.configs.recommended.rules,

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

			"react/prop-types": "off",
		},
	}
);
