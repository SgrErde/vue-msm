import request from '@/utils/request.js';
export function login(username, password) {
    return request({
        url: '/user/login',
        method: 'post',
        data: {
            username,
            password
        }
    });
}
export function getUserInfo(token) {
    return request({
        url: `/user/info/${token}`,
        method: 'get',
    });
}
//退出系统
export function logout(token) {
    return request({
        url: `/user/logout`,
        method: 'post',
        data: {
            token
        }
    });
}