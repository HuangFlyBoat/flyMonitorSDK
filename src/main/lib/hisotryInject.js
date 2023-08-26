import onLoad from "../utils/onLoad";
export function historyPageInject (tracker) {
    let beforeTime = Date.now(); // 进入页面的时间
    let beforePage = ''; // 上一个页面

    /**
     * 获取停留时间
     * @returns number
     */
    function getStayTime () {
        let curTime = Date.now();
        let stayTime = curTime - beforeTime;
        beforeTime = curTime;
        return stayTime;
    }

    function onChangePage (action) {
        const stayTime = getStayTime();
        const currentPage = window.location.href;
        if (action !== 'load') {
            tracker.send({
                kind: 'experience',
                type: 'history',
                action,
                stayTime,
                page: beforePage,
            })
        }
        beforePage = currentPage;
    }

    onLoad(function () {
        beforePage = location.href;
        onChangePage('load');
    })

    // 通过 popstate事件 直接监听到 history.go() history.back() history.forward() 
    window.addEventListener('popstate', function () {
        onChangePage('popstate');
    })

    // 重写 history 的 pushState 和 replaceState 方法, 使得其能够派发对应事件
    function createHistoryEvent (name) {
        // 拿到原来的方法
        const origin = window.history[name];
        return function (event) {
            if (name === 'replaceState') {
                const { current } = event;
                const pathName = location.pathname;
                // 如果访问路径没变则什么也不做
                if (current === pathName) {
                    let res = origin.apply(this, arguments);
                    return res;
                }
            }
            let res = origin.apply(this, arguments);
            // 自定义事件并派发
            let e = new Event(name)
            e.arguments = arguments;
            window.dispatchEvent(e);
            return res;
        }
    }
    window.history.pushState = createHistoryEvent('pushState');
    window.history.replaceState = createHistoryEvent('replaceState');

    // 通过重写history方法和自定义事件来监听 pushState 和 replaceState 行为
    window.addEventListener('replaceState', function () {
        onChangePage('replaceState');
    })
    window.addEventListener('pushState', function () {
        onChangePage('pushState');
    })
    // 监听项目加载和卸载时
    window.addEventListener('onload', function () {
        onChangePage('load');
    })
    window.addEventListener('unload', function () {
        onChangePage('unload');
    })
}