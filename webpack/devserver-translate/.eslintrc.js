module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    document: false, // document（全局变量） 后面的代码不允许进行覆盖
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  parser: 'babel-eslint', // 解析器
  rules: { // 不许遵守的规则可以在这里配置
    'import/no-extraneous-dependencies': 0,
    'semi': 0,
    'indent': 0,
    'react/prefer-stateless-function': 0,
    'space-before-blocks': 0,
    'keyword-spacing': 0,
    'react/jsx-indent': 0,
    'react/jsx-filename-extension': 0
  }
};
