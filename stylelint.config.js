// https://stylelint.io/user-guide/configure/
// https://stylelint.io/awesome-stylelint/

export default {
  cache: true,
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
    'stylelint-config-hudochenkov/order',
  ],
  fix: false,
  plugins: [
    'stylelint-high-performance-animation',
  ],
  rules: {
    'hue-degree-notation': 'number',
    'selector-class-pattern': [/^[a-z]+([A-Z]?[a-z0-9]+)+$/, {
      message: 'Expected class selector "%s" to be camelCase',
    }],
    'selector-pseudo-element-colon-notation': 'single',
    'value-keyword-case': ['lower', {
      camelCaseSvgKeywords: true,
    }],
    'plugin/no-low-performance-animation-properties': true,
  },
};
