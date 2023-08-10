const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    context: process.cwd(),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'monitor.js',
    },
    devServer: {
        static: [path.resolve(__dirname, 'dist')],
        // 配置请求响应
        setupMiddlewares: function(middlewares, devServer) {
            devServer.app.get('/api/users', function(req, res) {
              res.send([
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
                { id: 3, name: 'Charlie' }
              ])
            });
            devServer.app.post('/api/error', function(req, res) {
                res.status(500).send('发生了一个错误');
            })
            return middlewares;
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head'
        })
    ]
}