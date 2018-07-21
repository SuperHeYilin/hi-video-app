import { routerReducer } from 'react-router-redux';

import menus from './menus';
import control from './control';
// import maps from './map';
// import files from './business/file';

const reducers = {
	routing: routerReducer,
	menus,
	control,
	// files
}

/**
 * 設置持久化白名單
 */
const whitelist = [
	'control',
	// 'menus',
]

export {
	reducers,
	whitelist,
}