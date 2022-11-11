module.exports = {
    extends: 'stylelint-config-standard',
    plugins: [
        'stylelint-scss'
    ],
    rules: {
        indentation: 4,
        'font-family-no-missing-generic-family-keyword': null,
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['mixin', 'include']
            }
        ]
    }
};
