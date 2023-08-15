import tracker from '../utils/tracker';
export function injectFetchError() {
   const oldFetch = fetch;

   window.fetch = async (...args) => {
    let [resourceURL, config ] = args;

    // 记录正式发起请求前时间
    let startTime = Date.now();
    let resp = await oldFetch(resourceURL, config);

    if (!resourceURL.match(/logstores/) && !resourceURL.match(/sockjs/)) {
        // 使用 clone 允许 body 对象可以使用多次（fetch返回的response是一次性使用)
        resp.clone().json().then((data)=>{
            tracker.send({
                kind: 'stability',
                type: 'fetch',
                eventType: resp.type,
                pathname: resourceURL,
                status: resp.status + '-' + resp.statusText, // 状态码
                duration: Date.now() - startTime, // 持续时间
                response: data,
                params: config.body || ''
            });
        });
     }
   return resp;
 }
}