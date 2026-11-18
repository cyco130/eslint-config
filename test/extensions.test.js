// @ts-check
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { ESLint } from "eslint";
import nodeConfig from "../node.js";
import reactConfig from "../react.js";

const fixtures = path.join(import.meta.dirname, "fixtures");

/**
 * Lint a fixture and return its extension-related messages as
 * `line: ruleId: message` strings.
 *
 * @param {import("eslint").Linter.Config[]} config
 * @param {string} file
 */
async function lint(config, file) {
	const eslint = new ESLint({
		cwd: fixtures,
		overrideConfigFile: true,
		overrideConfig: [
			...config,
			{
				languageOptions: {
					parserOptions: {
						projectService: true,
						tsconfigRootDir: fixtures,
					},
				},
				// "detect" crashes eslint-plugin-react on ESLint 10
				settings: { react: { version: "19.0" } },
			},
		],
	});

	const [result] = await eslint.lintFiles([file]);
	assert.deepEqual(
		result.messages.filter((message) => message.fatal),
		[],
	);

	return result.messages
		.filter(
			(message) =>
				message.ruleId === "cyco130/ts-extension" ||
				message.ruleId === "import-x/extensions",
		)
		.map((message) => `${message.line}: ${message.ruleId}: ${message.message}`);
}

const configs = { node: nodeConfig, react: reactConfig };

for (const [name, config] of Object.entries(configs)) {
	test(`${name}: TypeScript files must import TypeScript files with their real extension`, async () => {
		assert.deepEqual(await lint(config, "src/probe.ts"), [
			// import "./debug";
			'1: import-x/extensions: Missing file extension "ts" for "./debug"',
			// import "./debug.js";
			'2: cyco130/ts-extension: "./debug.js" refers to a TypeScript file. Use "./debug.ts" instead.',
			// import "./view.js";
			'4: cyco130/ts-extension: "./view.js" refers to a TypeScript file. Use "./view.tsx" instead.',
			// import "./view.jsx";
			'5: cyco130/ts-extension: "./view.jsx" refers to a TypeScript file. Use "./view.tsx" instead.',
			// export * from "./debug.js";
			'10: cyco130/ts-extension: "./debug.js" refers to a TypeScript file. Use "./debug.ts" instead.',
			// export { debug as renamed } from "./debug.js";
			'11: cyco130/ts-extension: "./debug.js" refers to a TypeScript file. Use "./debug.ts" instead.',
			// export const lazy = () => import("./debug.js");
			'12: cyco130/ts-extension: "./debug.js" refers to a TypeScript file. Use "./debug.ts" instead.',
		]);
	});

	test(`${name}: JavaScript files may import real JavaScript files`, async () => {
		assert.deepEqual(await lint(config, "src/script.js"), [
			// import "./debug.js";
			'2: cyco130/ts-extension: "./debug.js" refers to a TypeScript file. Use "./debug.ts" instead.',
		]);
	});
}

test("the fix rewrites the extension and keeps the quotes", async () => {
	const eslint = new ESLint({
		cwd: fixtures,
		fix: true,
		overrideConfigFile: true,
		overrideConfig: [
			...nodeConfig,
			{
				languageOptions: {
					parserOptions: {
						projectService: true,
						tsconfigRootDir: fixtures,
					},
				},
				// Its fix would merge the probe's repeated imports
				rules: { "import-x/no-duplicates": "off" },
			},
		],
	});

	const [result] = await eslint.lintFiles(["src/probe.ts"]);
	const original = fs.readFileSync(path.join(fixtures, "src/probe.ts"), "utf8");

	assert.equal(
		result.output,
		original
			.replaceAll('"./view.js"', '"./view.tsx"')
			.replaceAll('"./view.jsx"', '"./view.tsx"')
			.replace('import "./debug.js";', 'import "./debug.ts";')
			.replace('export * from "./debug.js";', 'export * from "./debug.ts";')
			.replace('renamed } from "./debug.js";', 'renamed } from "./debug.ts";')
			.replace('import("./debug.js")', 'import("./debug.ts")'),
	);
});
