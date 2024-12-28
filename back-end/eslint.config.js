const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');
const disableAutofix = require('eslint-plugin-disable-autofix');

module.exports = tseslint.config({
    files: ['**/*.ts'],
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: __dirname,
        },
    },
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
        prettier,
    ],
    plugins: {
        'disable-autofix': disableAutofix,
    },
    rules: {
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        'disable-autofix/@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
            },
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
            },
            {
                // private variables and functions must have a leading underscore
                selector: 'memberLike',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'require',
            },
            {
                // type and interface names must be pascalcase
                selector: 'typeLike',
                format: ['PascalCase'],
            },
            {
                // interface name cannot start with I
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: false,
                },
            },
            {
                // enum values must be pascalcase
                selector: 'enumMember',
                format: ['PascalCase'],
            },
            {
                // global const variables must be in uppercase
                selector: 'variable',
                modifiers: ['const', 'global'],
                format: ['UPPER_CASE'],
            },
        ],
    },
});
