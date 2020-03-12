module.exports = {
    devServer: {
        port: 8888, //端口号
        host: 'localhost', //主机名
        https: false, //协议
        open: true, //自动打开
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_SERVICE_URL,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        }
    },
    lintOnSave: false, //关闭格式检查
    productionSourceMap: false //打包时不会产生.map文件，加快打包速度

}