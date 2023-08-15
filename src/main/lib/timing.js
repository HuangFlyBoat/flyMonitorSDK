import onload from "../utils/onLoad";
import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";

export function timing (tracker) {
    // 首次有意义的元素绘制的时间 和
    // 页面上最大的元素绘制的时间
    let FMP, LCP;

    // 自定义性能观测
    if (PerformanceObserver) {
        // 1. 观测页面中有意义的元素
        new PerformanceObserver((entryList, observer) => {
            let perfEntries = entryList.getEntries();
            FMP = perfEntries[0];
            observer.disconnect();
        }).observe({ entryTypes: ['element'] });
        // 2. 观测页面中最有意义的元素
        new PerformanceObserver((entryList, observer) => {
            let perfEntries = entryList.getEntries();
            LCP = perfEntries[0];
            observer.disconnect();
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        // 3. 观测页面中的首次输入延迟时间
        new PerformanceObserver((entryList, observer) => {
            let lastEvent = getLastEvent();
            let firstInput = entryList.getEntries()[0];
            if (firstInput) {
                //processingStart开始处理的时间 startTime开点击的时间 差值就是处理的延迟
                let inputDelay = firstInput.processingStart - firstInput.startTime;
                let duration = firstInput.duration;//处理的耗时
                if (inputDelay > 0 || duration > 0) {
                    tracker.send({
                        kind: 'experience',//用户体验指标
                        type: 'firstInputDelay',//首次输入延迟
                        inputDelay,//延时的时间
                        duration,//处理的时间
                        startTime: firstInput.startTime,
                        selector: lastEvent ? getSelector(lastEvent || lastEvent.target) : ''
                    });
                }

            }
            observer.disconnect();//不再观察了
        }).observe({ type: 'first-input', buffered: true });//观察页面中的意义的元素
    }


    onload(function () {
        setTimeout(() => {
            const {
                // 开始获取当前页面资源的时间
                fetchStart,
                // TCP 连接开始时间
                connectStart,
                // TCP 握手结束时间
                connectEnd,
                // 开始正式发起请求时间
                requestStart,
                // 响应开始时间
                responseStart,
                // 响应结束时间
                responseEnd,
                // DOM可交互时间。它表示浏览器完成解析并准备加载子资源的时间戳。在此之前，页面的大部分内容已经解析完毕，用户可以与页面进行交互
                domInteractive,
                // 指示浏览器已经完全解析HTML文档并构建了DOM树，所有脚本文件已经可用，但可能还有其他资源（如图像）正在加载
                // 这意味着页面的结构已经可以访问和操作，但某些资源可能尚未完全加载
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                // 表示页面的所有资源（包括子资源）已经加载完成
                loadEventStart
            } = performance.getEntriesByType("navigation")[0];
            tracker.send({
                kind: 'experience',//用户体验指标
                type: 'timing',//统计每个阶段的时间
                connectTime: connectEnd - connectStart,//连接时间
                ttfbTime: responseStart - requestStart,//首字节到达时间
                responseTime: responseEnd - responseStart,//响应的读取时间
                parseDOMTime: loadEventStart - responseEnd,//DOM解析的时间
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart,//首次可交互时间
                loadTIme: loadEventStart - fetchStart //完整的加载时间
            });
        }, 3000);
        setTimeout(() => {
            // 包括了用户自定义的背景绘制，它是首次将像素绘制到屏幕的时刻
            let FP = performance.getEntriesByName('first-paint')[0];
            // 是浏览器将第一个DOM渲染到屏幕的时间，相当于白屏时间
            let FCP = performance.getEntriesByName('first-contentful-paint')[0];
            //开始发送性能指标
            tracker.send({
                kind: 'experience',//用户体验指标
                type: 'paint',//统计每个阶段的时间
                firstPaint: FP.startTime,
                firstContentfulPaint: FCP.startTime,
                firstMeaningfulPaint: FMP?.startTime,
                largestContentfulPaint: LCP?.startTime
            });
        }, 3500);
    })
}