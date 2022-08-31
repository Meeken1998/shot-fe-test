export const enum ToolbarStates {
  SYMBOL = 'symbol',
  EL_ANIMATION = 'elAnimation',
  EL_STYLE = 'elStyle',
  EL_POSITION = 'elPosition',
  SLIDE_DESIGN = 'slideDesign',
  SLIDE_ANIMATION = 'slideAnimation',
  MULTI_POSITION = 'multiPosition',
  HISTORY = 'history'
}

export const slideEditorTools: { key: string; iconUrl: string; name: string }[] = [
  {
    key: 'undo',
    iconUrl: 'https://static.aside.fun/upload/undo.svg',
    name: '撤销',
  },
  {
    key: 'remake',
    iconUrl: 'https://static.aside.fun/upload/remake.svg',
    name: '重做',
  },
  {
    key: 'text',
    iconUrl: 'https://static.aside.fun/upload/text.svg',
    name: '文本',
  },
  {
    key: 'image',
    iconUrl: 'https://static.aside.fun/upload/image.svg',
    name: '图片',
  },
  {
    key: 'shape',
    iconUrl: 'https://static.aside.fun/upload/shape.svg',
    name: '形状',
  },
  {
    key: 'line',
    iconUrl: 'https://static.aside.fun/upload/line.svg',
    name: '线条',
  },
  {
    key: 'grid',
    iconUrl: 'https://static.aside.fun/upload/grid.svg',
    name: '图表',
  },
  {
    key: 'table',
    iconUrl: 'https://static.aside.fun/upload/table.svg',
    name: '表格',
  },
  {
    key: 'formula',
    iconUrl: 'https://static.aside.fun/upload/formula.svg',
    name: '公式',
  },
  {
    key: 'media',
    iconUrl: 'https://static.aside.fun/upload/media.svg',
    name: '媒体',
  },
]
