let lastEvent;
['click', 'touchstart', 'mouseover', 'keydown', 'mousedown'].forEach(eventType => {
    document.addEventListener(eventType, event => {
        lastEvent = event;
    }, {
        capture: true, // 在捕获阶段触发,
        passive: true // 不阻止默认事件
    })
});

export default function () {
    return lastEvent;
}
