import axios from 'axios';
import {
    Loading,
    Message
} from 'element-ui'

const BASE_URL = process.env.VUE_APP_BASE_API;
const request = axios.create({
    baseURL: BASE_URL,
    timeout: 5000 //响应超时时间，5000毫秒
});
const loading = {
    loadingInstance: null,
    open: function () {
        if (this.loadingInstance === null) {
            console.log('创建加载中实例')
            this.loadingInstance = Loading.service({
                target: '.main',
                text: '拼命加载中...'
            });
        }

    },
    close: function () {
        if (this.loadingInstance !== null) {
            this.loadingInstance.close();
        }
        this.loadingInstance = null;


    }
}
//拦截 器
request.interceptors.request.use(config => {
    loading.open();
    return config;
}, error => {
    loading.close();
    return Promise.reject(error);
});
request.interceptors.response.use(response => {
    loading.close();
    const resp = response.data;
    if (resp.code !== 2000) {
        Message({
            type: 'error',
            message: resp.message || '系统异常',
            duration: 5 * 1000
        })
    }
    return response;
}, error => {
    loading.close();
    Message({
        type: 'error',
        message: error.message || '系统异常',
        duration: 5 * 1000
    })
    return Promise.reject(error);
});

export default request;