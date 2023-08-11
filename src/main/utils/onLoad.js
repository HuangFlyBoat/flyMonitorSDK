
/**
 * 在文档的 HTML 解析完成后立即执行
 * @param {Function} callback 
 */
export default function onLoad(callback) {
    if (document.readyState === 'complete') {
        callback();
    } else {
        window.addEventListener('load', callback);
    }
}