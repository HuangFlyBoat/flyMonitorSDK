/**
 * 根据事件数组返回对应路径字符串，去除了 document 和 window
 * @param {Array<Event>} composedPath 
 * @returns 
 */
function getSelectorPath (composedPath) {
    return composedPath.reverse().filter(element => {
        return element !== document && element !== window;
    }).map(element => {
        let selector = `${element.nodeName.toLowerCase()}`;
        if (element.id) {
            selector += `#${element.id}`;
        }
        if (element.className && typeof element.className === 'string') {
            selector += `.${element.className}`;
        }
        return selector;
    }).join(' ');
}

/**
 * 根据传入的事件返回路径字符串
 * @param {Event} e 
 * @returns {String}
 */
export default function getSelector (e){
    // 当前有直接return
    let pathArr = e.path || (e.composedPath && e.composedPath()); // 优先判断 Event.composedPath() 方法是否为空数组
    if (pathArr && pathArr.length > 0) { 
      return getSelectorPath(pathArr);
    }
    // 不存在则遍历target节点
    let target = e.target;
    pathArr = [];
    while (target.parentNode !== null) {
      pathArr.push(target);
      target = target.parentNode;
    }
    return getSelectorPath(pathArr);
};

