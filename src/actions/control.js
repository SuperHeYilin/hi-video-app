export const DO_COLLAPSE_CONTROL_PANEL = 'DO_COLLAPSE_CONTROL_PANEL'// 控制面板折叠展开'
export const DO_AFFIX_CONTENT = 'DO_AFFIX_CONTENT'// 固定内容区域'
export const DO_COLLAPSE_SIDER = 'DO_COLLAPSE_SIDER'// 面板折叠展开'
export const DO_CHANGE_THEME = 'DO_CHANGE_THEME'// 修改菜单主题颜色
export const DO_BACK_TOP = 'DO_BACK_TOP'// 是否显示返回顶部按钮
export const DO_GRID_RESIZE = 'DO_GRID_RESIZE'// 修改grid布局页面大小
export const DO_PAGE_ANIMATION = 'DO_PAGE_ANIMATION'// 页面是否有动画
export const DO_AFFIX_MENU = 'DO_AFFIX_MENU'// 是否固定菜单
export const DO_PAGE_LAYOUT = 'DO_PAGE_LAYOUT'// 更改菜单排版
export const DO_FULL_SCREEN = 'DO_FULL_SCREEN'// 保持全屏

export function doCollapseControlPanel(collapsed) {
    return {
        type: DO_COLLAPSE_CONTROL_PANEL,
        collapsed,
    }
}

export function doAffixContent(affixContent) {
    return {
        type: DO_AFFIX_CONTENT,
        affixContent,
    }
}

export function doCollapse(collapsed) { 
    return {
        type: DO_COLLAPSE_SIDER,
        collapsed,
    }
}

export function doChangeTheme(darkTheme) {
    return {
        type: DO_CHANGE_THEME,
        darkTheme,
    }
}

export function doBackTop(backTop) {
    return {
        type: DO_BACK_TOP,
        backTop,
    }
}

export function doGridResize(gridState) {
    return {
        type: DO_GRID_RESIZE,
        gridState,
    }
}

export function doPageAnimation(animation) {
    return {
        type: DO_PAGE_ANIMATION,
        animation,
    }
}

export function doAffixMenu(affixMenu) {
    return {
        type: DO_AFFIX_MENU,
        affixMenu
    }
}

export function doPageLayout(pageLayout) {
    return {
        type: DO_PAGE_LAYOUT,
        pageLayout
    }
}

export function doFullScreen(fullScreen) {
    return {
        type: DO_FULL_SCREEN,
        fullScreen
    }
}