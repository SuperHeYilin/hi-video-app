export const DO_PAGE_UPDATE = 'DO_PAGE_UPDATE';// 更新页面

export function doPageUpdate(pageUpdate) {
    return {
        type: DO_PAGE_UPDATE,
        pageUpdate,
    };
}
