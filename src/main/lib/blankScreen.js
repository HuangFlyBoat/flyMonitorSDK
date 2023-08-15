// 监控屏幕上出现异常白屏，没有正常渲染内容
import onload from "../utils/onLoad";

export function blankScreen (tracker, ignoreElement) {
    // 白名单，外层这些元素的渲染不算内容渲染。支持类名和ID
    let wrapperElements = ['html', 'body', '#container', '.content'];
    if (ignoreElement) {
        wrapperElements = wrapperElements.concat(ignoreElement);
    }
    // 存储扫描到的空白点位，当大于一定数目时则认为是白屏
    let emptyPoints = 0;

    /**
     * 返回元素名，用于与白名单里的名称比照
     * @param {HTMLElement} element 
     */
    function getSelectorName (element) {
        if (element.id) {
            return '#' + element.id;
        } else if (element.className) {
            return '.' + element.className;
        } else return element.nodeName.toLowerCase();
    }

    /**
     * 判断是否是白名单点
     * @param {HTMLElement} element 
     */
    function isWrapper (element) {
        let selectorName = getSelectorName(element);
        if (wrapperElements.includes(selectorName)) {
            emptyPoints += 1;
        }
    }

    onload(function () {
        let partLength = 10
        for (let i = 0; i < partLength; i++) {
            // 横竖中位线和对角线
            let xElements = document.elementsFromPoint(
                window.innerWidth * i / partLength, window.innerHeight / 2);
            let yElements = document.elementsFromPoint(
                window.innerWidth / 2, window.innerHeight * i / partLength);
            let xyElements = document.elementsFromPoint(
                window.innerWidth * i / partLength, window.innerHeight * i / partLength);
            let yxElements = document.elementsFromPoint(
                window.innerWidth * i / partLength, window.innerHeight * (partLength - 1 - i) / partLength);
            isWrapper(xElements[0]);
            isWrapper(yElements[0]);
            isWrapper(xyElements[0]);
            isWrapper(yxElements[0]);
        }
        // 设置阈值为空白点总数的百分之九十
        let limit = Number.parseInt(partLength * 4 * 0.9);
        if (emptyPoints >= limit) {
            let centerElements = document.elementsFromPoint(
                window.innerWidth / 2, window.innerHeight / 2
            );
            tracker.send({
                kind: 'stability',
                type: 'blank',
                emptyPoints,
                screen: window.screen.width + "X" + window.screen.height,
                viewPoint: window.innerWidth + "X" + window.innerHeight,
                selector: getSelectorName(centerElements[0])
            });
        }
    })

}