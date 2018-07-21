import lodash from 'lodash'
import {
    DO_CHANGE_OPEN_KEYS,
    DO_CHANGE_HOVER_OPEN_KEYS,
    DO_UPDATE_NAV_PATH,
    DO_INIT_MENUS,
} from '../actions/menus'

function doInitMenus(menuItems, currPath) {
    if (menuItems.length > 0) {
        const pathArray = getPathArray(lodash.cloneDeep(menuItems), {path: currPath})

        if (pathArray.length < 1) {
            return {}
        }

        const { navOpenKeys, selectedKeys, navpath } = buildSiderProps(pathArray[0])

        return { navOpenKeys, selectedKeys, navpath }
    }

    return {}
}

// 递归查找父级
function getPathArray(menuItems, current) {
    if (!menuItems) {
        return null
    } else {
        const pathMenu = menuItems.filter((item, index) => {
            if (item.menu_url === current.path || "/" + item.menu_url === current.path) {
                return true
            } else if (item.childs) {
                const childMenu = getPathArray(item.childs, current)
                if (childMenu.length > 0) {
                    item.child = childMenu[0]
                    delete item.childs
                    return true
                }
            }
            return false
        })

        return pathMenu
    }
}

function getNavOpenKeys(pathMeun, navOpenKeys = [], keyPath = []) {
    const { id, menuName, menuIcon, child = null } = lodash.cloneDeep(pathMeun)
    const pathItem = { id, name: menuName, icon: menuIcon }
    navOpenKeys.push(pathItem.id + "")
    keyPath.push(pathItem)
    if (child) {
        return getNavOpenKeys(child, navOpenKeys, keyPath)
    }

    return { navOpenKeys, keyPath }
}

// 构建参数
function buildSiderProps(pathMeun) {
    const { navOpenKeys, keyPath } = getNavOpenKeys(pathMeun)
    const selectedKeys = [navOpenKeys.pop()]// 移除最后一个元素，并得到selectkeys
    const navpath = {
        keyPath,
    }

    return { navOpenKeys, selectedKeys, navpath }
}

const initialState = {
    menuItems: [], // 菜单项
    navOpenKeys: [], // 展开的菜单
    selectedKeys: [], // 选中菜单项
    navpath: {// 菜单路径
        keyPath: [],
        selectedKeys: [],
    },
}

export default function menus(state = initialState, action = {}) {
    switch (action.type) {
        case DO_CHANGE_OPEN_KEYS:
            return Object.assign({}, state, {navOpenKeys: action.openKeys})
        case DO_CHANGE_HOVER_OPEN_KEYS:
            return Object.assign({}, state, {navHoverOpenKeys: action.openKeys})
        case DO_UPDATE_NAV_PATH: {
            const {keyPath, key} = action
            return Object.assign({}, state, {navpath: {keyPath, key}, selectedKeys: [key]})
        }
        case DO_INIT_MENUS: {
            const { data, currPath} = action
            const { navOpenKeys, selectedKeys, navpath } = doInitMenus(data, currPath)
            return Object.assign({}, state, {menuItems: data, navOpenKeys, selectedKeys, navpath})
        }
        default:
            return state
    }
}