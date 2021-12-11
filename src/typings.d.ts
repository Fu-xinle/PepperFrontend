/***************************************************************************************************
 * 前端引入JS库，无@types/xx定义类型.
 */

/**
 * ztree的声明文件"node_modules/@ztree/ztree_v3/index.d.ts"，
 * 之前添加在tsconfig.app.json文件files属性中，但作为jQuery插件应该在global命名空间中，
 * 因为jQuery是global的
 * !! zTree库的一个bug?
 */

declare global {
  // eslint-disable-next-line import/no-unassigned-import
  import '@ztree/ztree_v3';
}
