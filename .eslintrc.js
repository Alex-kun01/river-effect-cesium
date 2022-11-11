/*
 * @Description:
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-02-25 10:48:52
 * @LastEditors: yls
 * @LastEditTime: 2022-02-28 09:55:12
 */
module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'plugin:vue/essential',
        'google'
    ],
    'parserOptions': {
        'ecmaVersion': 12,
        'parser': '@typescript-eslint/parser',
        'sourceType': 'module'
    },
    'plugins': [
        'vue',
        '@typescript-eslint'
    ],
    globals: {
        CONFIG_MAP: false,
        CONFIG: false,
        THING: false,
        CMAP: false,
        config: false,
        uino: false,
        axios: false,
        defineEmits: true,
        defineProps: true,
        defineExpose: true,
        reactive: true,
        spray: false
    },
    'rules': {
        'max-len': 'off',
        'indent': ['error', 2],
        'linebreak-style': 'off',
        'guard-for-in': 'off',
        'vue/no-multiple-template-root': 'off',
        'no-var': 'error',
        'arrow-parens': 'off',
        'quote-props': 'off',
        'require-jsdoc': 'off',
        'object-curly-spacing': ['error', 'always'],
        '@typescript-eslint/ban-ts-ignore': 'off', // 允许使用注释或在指令后要求描述
        '@typescript-eslint/explicit-function-return-type': 'off', // 要求对函数和类方法进行显式返回类型
        // 允许使用any类型
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off', // 允许使用 require 语句
        '@typescript-eslint/no-empty-function': 'off', // 允许空函数
        'vue/custom-event-name-casing': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off', // 在定义变量之前允许使用变量
        '@typescript-eslint/ban-ts-comment': 'off', // 允许使用注释或在指令后要求描述@ts-<directive>
        '@typescript-eslint/ban-types': 'off', // 允许使用特定类型
        // 允许非空断言
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off', // 不要求导出的函数和类的公共类方法进行显式返回和参数类型
        '@typescript-eslint/no-unused-vars': [ // 允许未使用的变量
            'error',
            {
                argsIgnorePattern: '^h$',
                varsIgnorePattern: '^h$'
            }
        ],
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^h$',
                varsIgnorePattern: '^h$'
            }
        ],
        indent: ['error', 4, { SwitchCase: 1 }],
        'vue/html-indent': ['error', 4],
        'vue/html-quotes': ['error', 'double'],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-empty': ['error', { allowEmptyCatch: true }],
        // 推荐 warn
        'max-len': ['warn', { code: 200 }],
        'no-underscore-dangle': 'warn',
        'linebreak-style': ['off', 'windows'],
        'space-before-function-paren': 'off',
        'quotes': ['error', 'single'],
        'comma-dangle': ['error', 'never'],
        'function-paren-newline': ['error', { 'minItems': 4 }],
        // 'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
        'object-curly-newline': ['error', {
            // 'ObjectExpression': { 'multiline': true, 'minProperties': 3 },
            'ObjectPattern': { 'multiline': true, 'minProperties': 3 },
            'ImportDeclaration': { 'multiline': true, 'minProperties': 3 },
            'ExportDeclaration': { 'multiline': true, 'minProperties': 3 }
        }]
    }
};

