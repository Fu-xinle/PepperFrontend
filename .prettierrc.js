// 详细参考见 https://prettier.io/docs/en/index.html

module.exports = {
  // 超过最大值换行
  printWidth: 140,
  // Tab缩进宽度
  tabWidth: 2,
  // 缩进不使用tab，使用空格
  useTabs: false,
  // 句尾添加分号
  semi: true,
  // 使用单引号代替双引号
  singleQuote: true,
  // 为 HTML、Vue、Angular 和 Handlebars 指定全局空格敏感度，
  // "css"：css保留默认的空格样式，其他与strict相同；
  // "strict"：所有标签周围的空格均重要；
  // "ignore"：所有标签周围的空格均不重要.
  htmlWhitespaceSensitivity: 'strict',
  // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  arrowParens: 'avoid',
  // 在对象，数组括号与文字之间加空格
  bracketSpacing: true,
  // 按照markdown文本样式进行折行
  proseWrap: 'preserve',
  // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  trailingComma: 'es5',
  // 换行符，"lf" -仅换行符 (\n)，常见于 Linux 和 macOS 以及 git repos;
  // "crlf" - 回车 + 换行符 (\r\n)，在 Windows 上很常见;
  // "cr" - 仅回车符 (\r)，很少使用;
  // "auto" - 维护现有的行尾
  endOfLine: 'auto',
};
