import {
    DO_PAGE_UPDATE,
} from '../actions/content'

const initialState = {
    pageUpdate : true,// 是否更新页面,
}

export default function control(state = initialState, action = {}){
    switch (action.type) {
        case DO_PAGE_UPDATE:
            return Object.assign({}, state, {pageUpdate: action.pageUpdate})
        default:
            return state
    }
}