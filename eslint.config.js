const prettier = require("eslint-plugin-prettier");
const react = require("eslint-plugin-react");
const importPlugin = require("eslint-plugin-import");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const globals = require("globals");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [
    ...compat.extends("eslint:recommended", "prettier"),
    {
        ignores: [
            "**/node_modules/",
            "**/__tests__/",
            "**/fixtures/",
            "**/*.test.{js,jsx,ts,tsx}",
        ],
    },
    {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs", "**/*.mts", "**/*.cts"],

    plugins: {
        prettier,
        react,
        import: importPlugin,
        "jsx-a11y": jsxA11y,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/function-component-definition": [1, {
            namedComponents: "arrow-function",
            unnamedComponents: "arrow-function",
        }],

        "react/jsx-fragments": 0,
        "react/jsx-no-useless-fragment": "error",
        "react/self-closing-comp": "error",

        "react/jsx-filename-extension": ["error", {
            extensions: [".jsx"],
        }],

        "react/jsx-boolean-value": ["error", "never"],
        "import/named": "error",
        "import/no-unresolved": "error",
        "import/no-duplicates": "error",

        "import/no-cycle": [2, {
            ignoreExternal: false,
            maxDepth: 2,
        }],

        "import/newline-after-import": ["error", {
            count: 1,
        }],

        "import/order": ["error", {
            groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
            "newlines-between": "always",
        }],

        semi: ["error", "always"],
        "spaced-comment": [2, "always"],
        "arrow-body-style": ["error", "as-needed"],

        "no-use-before-define": ["error", {
            functions: false,
        }],

        "no-unused-vars": ["error", {
            args: "after-used",
        }],

        "no-else-return": "error",

        "jsx-a11y/anchor-is-valid": ["error", {
            components: ["Link"],
            specialLink: ["hrefLeft", "hrefRight"],
            aspects: ["invalidHref", "preferButton"],
        }],

        "jsx-a11y/label-has-associated-control": ["error", {
            required: {
                some: ["nesting", "id"],
            },
        }
    ],
    },
}];