import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from './theme';

export const toolbarConfig:{tools:{[key: string]: any}} = {
    tools:{
        'flow':[
            {
                type: 'undo',
                name: 'undo',
                group: 'undo-redo',
                attrs: {
                    button: {
                        'data-tooltip': '撤消 <i>(Ctrl+Z)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'redo',
                name: 'redo',
                group: 'undo-redo',
                attrs: {
                    button: {
                        'data-tooltip': '恢复 <i>(Ctrl+Y)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'zoom-in',
                name: 'zoom-in',
                group: 'zoom',
                max: ZOOM_MAX,
                step: ZOOM_STEP,
                attrs: {
                    button: {
                        'data-tooltip': '放大 <i>(Ctrl+Plus)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'zoom-out',
                name: 'zoom-out',
                group: 'zoom',
                min: ZOOM_MIN,
                step: ZOOM_STEP,
                attrs: {
                    button: {
                        'data-tooltip': '缩小 <i>(Ctrl+Minus)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'zoom-to-fit',
                name: 'zoom-to-fit',
                group: 'zoom',
                max: ZOOM_MAX,
                min: ZOOM_MIN,
                step: ZOOM_STEP,
                attrs: {
                    button: {
                        'data-tooltip': '自适应 <i>(Ctrl+0)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'button',
                name: 'set-property',
                group: 'custom-tool',
                text: '',
                attrs: {
                    button: {
                        'data-tooltip': '设置节点属性 <i>(Ctrl+O)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'button',
                name: 'save',
                group: 'custom-tool',
                text: '',
                attrs: {
                    button: {
                        'data-tooltip': '保存 <i>(Ctrl+S)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'button',
                name: 'save-as',
                group: 'custom-tool',
                text: '',
                attrs: {
                    button: {
                        'data-tooltip': '另存为 <i>(F12)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
        ],
        'geoprocessing-model':[
            {
                type: 'undo',
                name: 'undo',
                group: 'undo-redo',
                attrs: {
                    button: {
                        'data-tooltip': '撤消 <i>(Ctrl+Z)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'redo',
                name: 'redo',
                group: 'undo-redo',
                attrs: {
                    button: {
                        'data-tooltip': '恢复 <i>(Ctrl+Y)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'zoom-in',
                name: 'zoom-in',
                group: 'zoom',
                max: ZOOM_MAX,
                step: ZOOM_STEP,
                attrs: {
                    button: {
                        'data-tooltip': '放大 <i>(Ctrl+Plus)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'zoom-out',
                name: 'zoom-out',
                group: 'zoom',
                min: ZOOM_MIN,
                step: ZOOM_STEP,
                attrs: {
                    button: {
                        'data-tooltip': '缩小 <i>(Ctrl+Minus)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'zoom-to-fit',
                name: 'zoom-to-fit',
                group: 'zoom',
                max: ZOOM_MAX,
                min: ZOOM_MIN,
                step: ZOOM_STEP,
                attrs: {
                    button: {
                        'data-tooltip': '自适应 <i>(Ctrl+0)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'button',
                name: 'save',
                group: 'custom-tool',
                text: '',
                attrs: {
                    button: {
                        'data-tooltip': '保存 <i>(Ctrl+S)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'button',
                name: 'save-as',
                group: 'custom-tool',
                text: '',
                attrs: {
                    button: {
                        'data-tooltip': '另存为 <i>(F12)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            },
            {
                type: 'button',
                name: 'debug',
                group: 'custom-tool',
                text: '',
                attrs: {
                    button: {
                        'data-tooltip': '调试运行、试运行 <i>(Ctrl+D)</i>',
                        'data-tooltip-position': 'top'
                    }
                }
            }
        ]
    } 
};
