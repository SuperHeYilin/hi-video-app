import {
    DO_COLLAPSE_SIDER,
    DO_COLLAPSE_CONTROL_PANEL,
    DO_CHANGE_THEME,
    DO_AFFIX_CONTENT,
    DO_BACK_TOP,
    DO_GRID_RESIZE,
    DO_PAGE_ANIMATION,
    DO_AFFIX_MENU,
    DO_PAGE_LAYOUT,
    DO_FULL_SCREEN,
} from '../actions/control'
import { getGridState } from '../utils'

const initialState = {
    darkTheme: false, // 白色
    siderCollapsed: false, // 折叠状态
    controlCollapsed: false, // 折叠状态
    affixContent: true, // 是否固定內容區
    backTop: true, // 是否显示返回顶部按钮
    gridState: getGridState(), // 初始化页面大小
    pageAnimation: true, // 是否有动画
    affixMenu: false, // 是否固定菜单
    pageLayout: 2, // 排版样式
    fullScreen: false,
}

export default function control(state = initialState, action = {}) {
  switch (action.type) {
    case DO_COLLAPSE_SIDER:
        return Object.assign({}, state, {siderCollapsed: action.collapsed})
    case DO_CHANGE_THEME:
        return Object.assign({}, state, {darkTheme: action.darkTheme})
    case DO_COLLAPSE_CONTROL_PANEL:
        return Object.assign({}, state, {controlCollapsed: action.collapsed})
    case DO_AFFIX_CONTENT:
        return Object.assign({}, state, {affixContent: action.affixContent})
    case DO_BACK_TOP:
        return Object.assign({}, state, {backTop: action.backTop})
    case DO_GRID_RESIZE:
        return Object.assign({}, state, {gridState: action.gridState})
    case DO_PAGE_ANIMATION:
        return Object.assign({}, state, {pageAnimation: action.animation})
    case DO_AFFIX_MENU:
        return Object.assign({}, state, {affixMenu: action.affixMenu})
    case DO_PAGE_LAYOUT:
        return Object.assign({}, state, {pageLayout: action.pageLayout})
    case DO_FULL_SCREEN:
        return Object.assign({}, state, {fullScreen: action.fullScreen})
    default:
        return state
  }
}