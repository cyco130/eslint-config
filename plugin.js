// @ts-check
import fs from "node:fs";
import path from "node:path";

/**
 * JavaScript extensions and the TypeScript extensions that a resolver may
 * substitute for them.
 *
 * @type {Record<string, string[]>}
 */
const TS_COUNTERPARTS = {
	".js": [".ts", ".tsx"],
	".jsx": [".tsx"],
	".mjs": [".mts"],
	".cjs": [".cts"],
};

/**
 * Find the TypeScript source that a relative JavaScript specifier really
 * refers to. Returns the specifier rewritten with the TypeScript extension, or
 * undefined when the specifier is fine as it is.
 *
 * @param {string} specifier
 * @param {string} importerFilename
 */
function findTsSpecifier(specifier, importerFilename) {
	if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
		return undefined;
	}

	// Leave any ?query or #hash suffix alone
	const suffixStart = specifier.search(/[?#]/);
	const pathname =
		suffixStart === -1 ? specifier : specifier.slice(0, suffixStart);
	const suffix = suffixStart === -1 ? "" : specifier.slice(suffixStart);

	const extension = path.extname(pathname);
	const candidates = TS_COUNTERPARTS[extension];
	if (!candidates) {
		return undefined;
	}

	const target = path.resolve(path.dirname(importerFilename), pathname);
	if (fs.existsSync(target)) {
		// A real JavaScript file: the extension is correct
		return undefined;
	}

	const stem = target.slice(0, -extension.length);
	const found = candidates.find((candidate) => fs.existsSync(stem + candidate));
	if (!found) {
		return undefined;
	}

	return pathname.slice(0, -extension.length) + found + suffix;
}

/**
 * `eslint-plugin-import-x` ignores type-only imports and exports in its
 * `extensions` rule by default. Do the same here.
 *
 * @param {any} node
 */
function isTypeOnly(node) {
	if (node.importKind === "type" || node.exportKind === "type") {
		return true;
	}

	/** @type {any[]} */
	const specifiers = node.specifiers ?? [];
	return (
		specifiers.length > 0 &&
		specifiers.every(
			(specifier) =>
				specifier.importKind === "type" || specifier.exportKind === "type",
		)
	);
}

/** @type {import("eslint").Rule.RuleModule} */
const tsExtension = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Require the TypeScript extension when a relative import refers to a TypeScript file",
		},
		fixable: "code",
		schema: [],
		messages: {
			useTsExtension:
				'"{{specifier}}" refers to a TypeScript file. Use "{{fixed}}" instead.',
		},
	},
	create(context) {
		/**
		 * @param {any} node
		 */
		function check(node) {
			const source = node.source;
			if (
				!source ||
				source.type !== "Literal" ||
				typeof source.value !== "string" ||
				isTypeOnly(node)
			) {
				return;
			}

			const specifier = source.value;
			const fixed = findTsSpecifier(specifier, context.physicalFilename);
			if (!fixed) {
				return;
			}

			context.report({
				node: source,
				messageId: "useTsExtension",
				data: { specifier, fixed },
				fix(fixer) {
					const quote = source.raw[0];
					return fixer.replaceText(source, quote + fixed + quote);
				},
			});
		}

		return {
			ImportDeclaration: check,
			ExportNamedDeclaration: check,
			ExportAllDeclaration: check,
			ImportExpression: check,
		};
	},
};

/** @type {import("eslint").ESLint.Plugin} */
const plugin = {
	meta: {
		name: "@cyco130/eslint-config",
	},
	rules: {
		"ts-extension": tsExtension,
	},
};

export default plugin;
