import onLoad from "../utils/onLoad";

// 在react里hash路由并不是通过hashchange来监听的，底层还是通过pushState
// 因此需要同时监听这两个事件完成
export function hashPageInject (tracker) {
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
                type: 'hash',
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

    // 通过 hashchange 事件监听到原生的 hash 路由切换
    window.addEventListener('hashchange', function () {
        onChangePage('hashchange');
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