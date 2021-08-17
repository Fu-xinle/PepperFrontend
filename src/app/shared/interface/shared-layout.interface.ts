/**sidebar导航栏菜单 */
export interface IMenuItem {
  id?: string;
  description?: string;
  /**类型:link、dropDown(包括子菜单)、extLink(外部链接) */
  type: string;
  /**显示的菜单名称 */
  name?: string;
  /**路由状态,即路由链接 */
  state?: string;
  icon?: string;
  tooltip?: string;
  /**disabled:true 则不显示 */
  disabled?: boolean;
  sub?: IChildItem[];
  badges?: IBadge[];
  active?: boolean;
}

/**sidebar导航栏子菜单 */
export interface IChildItem {
  id?: string;
  parentId?: string;
  type?: string;
  name: string;
  state?: string;
  icon?: string;
  sub?: IChildItem[];
  active?: boolean;
}

/**菜单右上角显示的标记 */
export interface IBadge {
  color: string;
  value: string;
}

export interface ISidebarState {
  /**导航栏菜单是否打开，与内容区域的样式类sidenav-open关联,设置内容区域的宽度*/
  sidenavOpen?: boolean;
  childnavOpen?: boolean;
}

/** 自定义动态切换布局的接口 */
export interface ICustomizerLayout {
  title: string;
  name: string;
  img: string;
}

/** 自定义动态切换主题颜色的接口 */
export interface ICustomizerTheme {
  sidebarClass: string;
  class: string;
  active: boolean;
}
