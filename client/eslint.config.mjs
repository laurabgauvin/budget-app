import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';
import { baseConfig } from '../eslint.config.mjs';

export default [
    ...baseConfig,
    ...tseslint.config(
        {
            files: ['**/*.ts'],
            languageOptions: {
                parser: tseslint.parser,
                parserOptions: {
                    project: './tsconfig.app.json',
                    tsconfigRootDir: import.meta.dirname,
                },
            },
            extends: [...angular.configs.tsRecommended],
            processor: angular.processInlineTemplates,
            rules: {
                'no-console': ['error', { allow: ['error'] }],
                '@typescript-eslint/no-inferrable-types': 'off',
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
            extends: [
                ...angular.configs.templateRecommended,
                ...angular.configs.templateAccessibility,
            ],
            rules: {},
        },
        {
            ignores: ['**/*spec.ts', '**/.angular/**'],
        }
    ),
];
