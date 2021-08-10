// 详细参考见         stylelint       => https://stylelint.io/user-guide/rules/about
// stylelint-config-standard         => https://github.com/stylelint/stylelint-config-standard
// stylelint-config-prettier         => https://github.com/prettier/stylelint-config-prettier
// stylelint-config-sass-guidelines  => https://github.com/bjankord/stylelint-config-sass-guidelines
// stylelint-config-hudochenkov      => https://github.com/hudochenkov/stylelint-config-hudochenkov

// stylelint-order                   => https://github.com/hudochenkov/stylelint-order
// stylelint-scss                    => https://github.com/kristerkari/stylelint-scss

module.exports = {
  // stylelint-config-standard:stylelint的标准可共享配置,启用附加规则以强制执行少数CSS样式指南中的常见样式约定，
  //  The Idiomatic CSS Principles, Google's CSS Style Guide, Airbnb's Styleguide, @mdo's Code Guide。
  // stylelint-config-prettier:关闭所有不必要的或可能与 Prettier 冲突的规则。
  // stylelint-config-sass-guidelines:根据 https://sass-guidelin.es/ 中记录的SCSS指南使用SCSS语法设计/测试的,
  // 与 SCSS 语法一起使用,stylelint官方推荐，依赖'stylelint-order', 'stylelint-scss'插件。
  // stylelint-config-hudochenkov:stylelint之父的stylelint配置,依赖'stylelint-order', 'stylelint-scss'插件。
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-sass-guidelines',
    'stylelint-config-hudochenkov/full',
  ],
  // stylelint-order:stylelint的与CSS属性顺序相关的规则插件包。
  // stylelint-scss:stylelint-scss引入了特定于SCSS语法的规则
  plugins: ['stylelint-order', 'stylelint-scss'],
  rules: {
    // 缩进由tab修改为2个空格
    indentation: [2],
    // stylelint-config-hudochenkov扩展中设置了CSS属性的排序，
    // 不再使用stylelint-order中的按字母书序排序
    'order/properties-alphabetical-order': [null, { disableFix: true }],
    // 允许自定义类型
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/^app-/'],
      },
    ],
    // 自定义前缀的伪元素选择器。
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['ng-deep'],
      },
    ],
    // 限制选择器中类型选择器的数量,不应多层查找
    'selector-max-type': [
      2,
      {
        ignore: ['child', 'next-sibling'],
      },
    ],
    // css声明块中尾部的分号；只有一句时可以忽略
    'declaration-block-trailing-semicolon': [
      'always',
      {
        ignore: ['single-declaration'],
      },
    ],
    // 不允许按类型限定选择器;类型后面跟属性、类和id选择器允许
    // 属性:input[type='button'];类:a.foo;id:a#foo
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute', 'class', 'id'],
      },
    ],
    // scss是否允许为空
    'no-empty-source': null,
    // 换行符是unix格式还是windows格式,null标识关闭此规则检查
    // 保留原有的换行符
    linebreaks: null,
    // 不允许低特异性的选择器出现在覆盖高特异性的选择器之后。
    // 主要考虑scss存在嵌套
    'no-descending-specificity': null,
  },
  // 将其限定为src中的scss
  ignoreFiles: ['src/assets/**/*', '.git/**/*', '.husky/**/*', '.vscode/**/*', 'node_modules/**/*', '**/*.ts', '**/*.html', '**/*.js'],
};
