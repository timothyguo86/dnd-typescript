module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    /**
     * "off" or 0 - Turn off the rule
     * "warn" or 1 - Enable the rule as a warning (won't cause the program to exit)
     * "error" or 2 - Enable the rule as an error (program exits when triggered)
     */

    'comma-dangle': [2, 'never'], // Disallow trailing commas
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // Add exceptions for [no-extraneous-dependencies]
    indent: 0,
    'no-console': 1, // Display warnings for console.log() syntax
    'no-dupe-args': 2, // Disallow duplicate arguments in function definitions
    'no-dupe-keys': 2, // Disallow duplicate keys in object literals
    'no-duplicate-case': 2, // Disallow a duplicate case label within a switch statement
    'no-empty': 2, // Disallow empty block statements
    'no-extra-semi': 2, // Disallow unnecessary semicolons
    'no-func-assign': 2, // Disallow overwriting functions declared as variables
    'no-mixed-spaces-and-tabs': 2, // Disallow mixed spaces and tabs for indentation
    'no-plusplus': 0, // Allow usage of unary operator '++'
    'no-undef': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Turn off warnings for all undefined variables
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto' // Disable prettier from enforcing a specific line ending format
      }
    ],
    quotes: [2, 'single'], // Use single quotes
    semi: [2, 'never'] // Require or disallow semicolons instead of ASI; 'never' disallows them
  }
}
