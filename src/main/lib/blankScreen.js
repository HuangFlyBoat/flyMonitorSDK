// 监控屏幕上出现异常白屏，没有正常渲染内容

import onload from "../utils/onLoad";

export function blankScreen() {
    // 白名单，外层这些元素的渲染不算内容渲染
    let wrapperElements = ['html', 'body', '#container', '.content'];
    // 存储扫描到的空白点位，当大于一定数目时则认为是白屏
    let emptyPoints = 0;

    /**
     * 返回元素名，用于与白名单里的名称比照
     * @param {HTMLElement} element 
     */
    function getSelectorName(element) {
        if (element.id) {
            return '#'+ element.id;
        } else if (element.className) {
            return '.' + element.className;
        } else return element.nodeName.toLowerCase();
    }

    /**
     * 判断是否是白名单点
     * @param {HTMLElement} element 
     */
    function isWrapper(element) {
        let selectorName = getSelectorName(element);
        if (!wrapperElements.includes(selectorName)) {
            emptyPoints += 1;
        }
    }

    onload(function () {
        
    })
    
}