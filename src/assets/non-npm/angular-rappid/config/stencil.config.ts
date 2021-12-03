/**
 * stencilConfig 定义模板节点时,可设置属性新的值形成不同的模板节点
 */
export const stencilConfig = {
    shapes: [
      {
        name: 'StartNode',
        attrs: {
          label: { text: '开始' },
        },
      },
      {
        name: 'EndNode',
      },
      {
        name: 'FlowNode',
      },
      {
        name: 'BranchNode',
      },
    ],
  };