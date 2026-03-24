const stylistic = require('@stylistic/eslint-plugin')

module.exports = [
  {
    ignores: ['assets/vendor/mathjax/**']
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        expect: 'readonly',
        test: 'readonly'
      }
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        document: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        window: 'readonly'
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/brace-style': ['error', 'allman', { allowSingleLine: false }],
      'max-len': ['error', { code: 90 }],
      '@stylistic/semi': ['error', 'never']
    }
  }
]
