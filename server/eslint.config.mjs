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
                    project: './tsconfig.json',
                    tsconfigRootDir: import.meta.dirname,
                },
            },
        },
        {
            ignores: ['**/*spec.ts'],
        }
    ),
];
