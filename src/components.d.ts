import { icons } from '@/plugins/icon'
import { components } from '@/plugins/component'

type Icon = typeof icons
type CustomComponent = typeof components

declare module 'vue' {
  export type $worker = any
  export interface GlobalComponents extends Icon, CustomComponent {
    // antd 组件
    InputNumber: typeof import('ant-design-vue')['InputNumber']
    Divider: typeof import('ant-design-vue')['Divider']
    Button: typeof import('ant-design-vue')['Button']
    ButtonGroup: typeof import('ant-design-vue')['Button']['Group']
    Tooltip: typeof import('ant-design-vue')['Tooltip']
    Popover: typeof import('ant-design-vue')['Popover']
    Slider: typeof import('ant-design-vue')['Slider']
    Select: typeof import('ant-design-vue')['Select']
    SelectOption: typeof import('ant-design-vue')['Select']['Option']
    SelectOptGroup: typeof import('ant-design-vue')['Select']['OptGroup']
    Switch: typeof import('ant-design-vue')['Switch']
    Radio: typeof import('ant-design-vue')['Radio']
    RadioGroup: typeof import('ant-design-vue')['Radio']['Group']
    RadioButton: typeof import('ant-design-vue')['Radio']['Button']
    Input: typeof import('ant-design-vue')['Input']
    InputGroup: typeof import('ant-design-vue')['Input']['Group']
    TextArea: typeof import('ant-design-vue')['Input']['TextArea']
    Modal: typeof import('ant-design-vue')['Modal']
    Dropdown: typeof import('ant-design-vue')['Dropdown']
    Menu: typeof import('ant-design-vue')['Menu']
    SubMenu: typeof import('ant-design-vue')['Menu']['SubMenu']
    MenuItem: typeof import('ant-design-vue')['Menu']['Item']
    MenuItemGroup: typeof import('ant-design-vue')['Menu']['ItemGroup']
    Checkbox: typeof import('ant-design-vue')['Checkbox']
    Drawer: typeof import('ant-design-vue')['Drawer']
    Spin: typeof import('ant-design-vue')['Spin']
    Avatar: typeof import('ant-design-vue')['Avatar']
    ConfigProvider: typeof import('ant-design-vue')['ConfigProvider']
    MenuDivider: typeof import('ant-design-vue')['MenuDivider']
    Upload: typeof import('ant-design-vue')['Upload']
    Tabs: typeof import('ant-design-vue')['Tabs']
    TabPane: typeof import('ant-design-vue')['TabPane']
    Empty: typeof import('ant-design-vue')['Empty']
    Skeleton: typeof import('vue-loading-skeleton')['Skeleton']
    SkeletonTheme: typeof import('vue-loading-skeleton')['SkeletonTheme'],
    Progress: typeof import('ant-design-vue')['Progress']
    AvatarGroup: typeof import('ant-design-vue')['Avatar']['Group']
    Popconfigm: typeof import('ant-design-vue')['Popconfirm']
  }
}

export {}
