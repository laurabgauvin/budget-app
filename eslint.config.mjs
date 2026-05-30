import eslint from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export const baseConfig = [
    ...tseslint.config({
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
        },
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            jsdoc.configs['flat/recommended-typescript'],
            jsdoc.configs['flat/logical-typescript'],
        ],
        rules: {
            'no-console': 'error',
            'prefer-template': 'error',
            'no-else-return': 'error',
            'no-lonely-if': 'error',
            eqeqeq: ['error', 'always'],
            '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowBoolean: true, allowNullish: true, allowNumber: true },
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
                    selector: 'memberLike',
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'require',
                },
                { selector: 'typeLike', format: ['PascalCase'] },
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    custom: { regex: '^I[A-Z]', match: false },
                },
                { selector: 'enumMember', format: ['PascalCase'] },
                { selector: 'variable', modifiers: ['const', 'global'], format: ['UPPER_CASE'] },
            ],
            'jsdoc/require-returns': 'off',
            'jsdoc/tag-lines': ['warn', 'always', { count: 0, startLines: 1 }],
            'jsdoc/require-param-description': 'off',
        },
    }),
    {
        ignores: ['**/dist/**', '**/out/**', '**/coverage/**', '**/node_modules/**'],
    },
];
