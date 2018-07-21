import { api, err } from '../utils'

export const DO_CHANGE_OPEN_KEYS = 'DO_CHANGE_OPEN_KEYS'// 修改选中菜单keys
export const DO_CHANGE_HOVER_OPEN_KEYS = 'DO_CHANGE_HOVER_OPEN_KEYS'// 修改选中菜单keys
export const DO_UPDATE_NAV_PATH = 'DO_UPDATE_NAV_PATH'// 更新选中路由
export const DO_INIT_MENUS = 'DO_INIT_MENUS'// 直接刷新浏览器初始化一些菜单参数

export function doChangeOpenKeys(nextOpenKeys) {
  return {
    type: DO_CHANGE_OPEN_KEYS,
    openKeys: nextOpenKeys,
  }
}

export function doChangeHoverOpenKeys(nextOpenKeys) {
  return {
    type: DO_CHANGE_HOVER_OPEN_KEYS,
    openKeys: nextOpenKeys,
  }
}

export function doUpdateNavPath(keyPath, key) {
  return {
    type: DO_UPDATE_NAV_PATH,
    keyPath,
    key,
  }
}

const initMenus = (data, currPath) => {
  return {
    type: DO_INIT_MENUS,
    data,
    currPath,
  }
}

export function doInitMenus(currPath) {
  return async (dispatch) => {
    api.get('/pt/menus/user')
    .then(data => {dispatch(initMenus(data, currPath))})
    .catch(err)
  }
}

