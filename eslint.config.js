const js = require('@eslint/js');

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
		},
		rules: {
			'no-lonely-if': 'error',
			'no-multi-spaces': 'error',
            'prefer-const': 'error',
		},
	},
];