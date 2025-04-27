const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');
const jsdoc = require('eslint-plugin-jsdoc');

module.exports = tseslint.config(
    {
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
            ...angular.configs.tsRecommended,
            jsdoc.configs['flat/recommended-typescript'],
            jsdoc.configs['flat/logical-typescript'],
            prettier,
        ],
        processor: angular.processInlineTemplates,
        rules: {
            'no-console': ['error', { allow: ['error'] }],
            'prefer-template': 'error',
            'no-else-return': 'error',
            'no-lonely-if': 'error',
            eqeqeq: ['error', 'always'],
            '@typescript-eslint/no-extraneous-class': [
                'error',
                {
                    allowWithDecorator: true,
                },
            ],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowBoolean: true,
                    allowNullish: true,
                    allowNumber: true,
                },
            ],
            '@typescript-eslint/prefer-readonly': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'error',
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
            'jsdoc/require-returns': 'off',
            'jsdoc/tag-lines': ['warn', 'always', { count: 0, startLines: 1 }],
            'jsdoc/require-param-description': 'off',
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
        rules: {},
    }
);
