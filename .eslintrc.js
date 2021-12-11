// *****extend 与 plugin的区别
// extends 使用一个配置文件，当您将其添加到扩展选项时，该文件会应用一组规则。
// 另一方面，插件为您提供了一组规则，您可以根据需要单独应用这些规则。
// 仅仅拥有一个插件并不强制执行任何规则。 您必须选择您需要的规则。
// 一个插件可能会为您提供零个、一个或多个配置文件。 如果插件提供了配置文件，
// 那么您可以在将插件添加到插件部分后，在扩展部分加载该文件。

// 详细参见      eslint     => https://eslint.bootcss.com/
// eslint-plugin-prettier  => https://github.com/prettier/eslint-plugin-prettier
// eslint-plugin-import    => https://github.com/import-js/eslint-plugin-import
// @typescript-eslint/eslint-plugin => https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
// @angular-eslint         => https://github.com/angular-eslint/angular-eslint
// eslint-plugin-jsdoc     => https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-access

module.exports = {
  root: true,
  ignorePatterns: ['src/assets/**/*', '.git/**/*', '.husky/**/*', '.vscode/**/*', 'node_modules/**/*'],
  parserOptions: {
    // 使用的ECMAScript版本,使用年份命名的版本或者3、5、6、7指定ECMAScript版本
    ecmaVersion: 2021,
  },
  overrides: [
    {
      files: ['*.ts'],
      // @typescript-eslint/parser - 将 TypeScript 转换成与 estree 兼容的形式，以便在ESLint中使用。
      // 默认是"esprima"
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
      // import  支持ES2015+(ES6+) 导入/导出语法的linting，并防止文件路径和导入名称拼写错误的问题。
      // @typescript-eslint/eslint-plugin 一个特定于 ESLint 的插件，
      // 当与 @typescript-eslint/parser 结合使用时，允许运行特定于TypeScript的linting规则。
      plugins: ['@typescript-eslint', 'import', 'unused-imports'],
      // prettier/recommended 将Prettier作为ESLint规则运行，并将差异报告为单个ESLint问题。
      // @angular-eslint ESLint对Angular项目进行lint的工具
      // eslint-plugin-jsdoc ESLint对注释的检查
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:prettier/recommended',
        'plugin:jsdoc/recommended',
      ],
      rules: {
        // 从ESLint中运行Prettier。
        // 启用 Prettier 配置文件的加载（默认值：true）
        'prettier/prettier': [
          'error',
          {},
          {
            usePrettierrc: true,
          },
        ],
        // 用@Component 修饰的类的名称必须带有后缀“Component”（或自定义）
        '@angular-eslint/component-class-suffix': [
          'error',
          {
            suffixes: ['Directive', 'Component', 'Base', 'Widget'],
          },
        ],
        // 用@Directive 修饰的类的名称必须带有后缀“Directive”
        '@angular-eslint/directive-class-suffix': [
          'error',
          {
            suffixes: ['Directive', 'Component', 'Base', 'Widget'],
          },
        ],
        // 组件选择器应遵循给定的命名规则。
        '@angular-eslint/component-selector': [
          'off',
          {
            type: ['element', 'attribute'],
            prefix: ['app', 'test'],
            style: 'kebab-case',
          },
        ],
        // 指令选择器应该遵循给定的命名规则。
        '@angular-eslint/directive-selector': [
          'off',
          {
            type: 'attribute',
            prefix: ['app'],
          },
        ],
        // 禁止使用 @Attribute 装饰器。
        '@angular-eslint/no-attribute-decorator': 'error',
        // 确保指令不会实现冲突的生命周期接口。
        '@angular-eslint/no-conflicting-lifecycle': 'off',
        // 禁止对 DI 使用 forwardRef 引用。
        '@angular-eslint/no-forward-ref': 'off',
        // style禁止使用host属性。
        '@angular-eslint/no-host-metadata-property': 'off',
        // 禁止显式调用生命周期方法。
        '@angular-eslint/no-lifecycle-call': 'off',
        // 不允许声明不纯的管道。
        '@angular-eslint/no-pipe-impure': 'error',
        //最好将 @Output 声明为只读，因为它们不应该被重新分配。
        '@angular-eslint/prefer-output-readonly': 'error',
        // 必须声明组件选择器。
        '@angular-eslint/use-component-selector': 'off',
        // 禁止使用 ViewEncapsulation.None
        '@angular-eslint/use-component-view-encapsulation': 'off',
        // 禁止通过向装饰器提供字符串来重命名指令输入。
        '@angular-eslint/no-input-rename': 'off',
        // 不允许将命名指令输出作为标准 DOM 事件。
        '@angular-eslint/no-output-native': 'off',
        // 将 T[] 或只读 T[] 用于简单类型（即只是原始名称或类型引用的类型）。
        // 将 Array<T> 或 ReadonlyArray<T> 用于所有其他类型（联合类型、交集类型、对象类型、函数类型等）。
        '@typescript-eslint/array-type': [
          'error',
          {
            default: 'array-simple',
          },
        ],
        // typescript变量命名
        // interface接口的命名遵循PascalCase格式，且具有I前缀
        // parameter命名遵循camelCase格式，可添加前下划线_(标识未使用的参数)
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            prefix: ['I'],
          },
          {
            selector: 'class',
            format: ['PascalCase'],
          },
          {
            selector: ['variable', 'classProperty'],
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: ['variable'],
            modifiers: ['const'],
            format: ['UPPER_CASE', 'camelCase'],
          },
          {
            selector: ['parameter'],
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: ['function', 'classMethod'],
            format: ['camelCase'],
          },
        ],
        // 禁止特定类型，并建议替代方案
        '@typescript-eslint/ban-types': [
          'off',
          {
            types: {
              String: {
                message: 'Use string instead.',
              },
              Number: {
                message: 'Use number instead.',
              },
              Boolean: {
                message: 'Use boolean instead.',
              },
              Function: {
                message: 'Use specific callable interface instead.',
              },
            },
          },
        ],
        // 在多个地方重复导入同一模块
        'import/no-duplicates': 'error',
        // 没有导出的模块，或在另一个模块中导出而没有匹配的导入
        'import/no-unused-modules': 'error',
        // unassigned 整体导入未as引用
        'import/no-unassigned-import': 'error',
        // 模块导入顺序中的约定;
        'import/order': [
          'error',
          {
            alphabetize: {
              order: 'asc',
              caseInsensitive: false,
            },
            'newlines-between': 'always',
            groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
            pathGroups: [
              {
                pattern: '@angular/**',
                group: 'builtin',
                position: 'before',
              },
            ],
            pathGroupsExcludedImportTypes: [],
          },
        ],
        // 禁止this别名
        '@typescript-eslint/no-this-alias': 'error',
        // 一致的成员声明顺序
        '@typescript-eslint/member-ordering': 'error',
        // 禁止不规则的空白
        'no-irregular-whitespace': 'error',
        // 禁止出现多行空行
        'no-multiple-empty-lines': 'error',
        // 禁用稀疏数组
        'no-sparse-arrays': 'error',
        // 禁止使用以对象字面量作为第一个参数的 Object.assign，优先使用对象扩展。
        'prefer-object-spread': 'error',
        // 要求使用模板字面量而非字符串连接
        'prefer-template': 'error',
        // 要求使用 const 声明那些声明后不再被修改的变量
        'prefer-const': 'error',
        // 强制一行的最大长度,prettier会强制140换行
        'max-len': ['error', { code: 140, tabWidth: 2, comments: 140 }],
        // 变量命名采用驼峰命名法
        camelcase: 'error',
        // 换行符是unix格式还是windows格式,null标识关闭此规则检查
        // 保留原有的换行符
        'linebreak-style': 'off',
        // 关闭eslint和@typescript-eslint/no-unused-vars中关于未使用变量的报错
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        // 未使用的import报错
        'unused-imports/no-unused-imports': 'error',
        // 未使用的变量和参数报错
        // after-used - 不检查最后一个使用的参数之前出现的未使用的位置参数，
        // 但是检查最后一个使用的参数之后的所有命名参数和所有位置参数。
        'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
    {
      files: ['*.html'],
      excludedFiles: ['*inline-template-*.component.html'],
      extends: ['plugin:prettier/recommended'],
      rules: {
        // parser:Prettier会自动从输入文件路径推断解析器,
        // 设置为angular解析模板html文件
        'prettier/prettier': [
          'error',
          {
            parser: 'angular',
          },
        ],
      },
    },
  ],
};
