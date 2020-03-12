import request from '@/utils/request';
export default {
    //校验旧密码，userId，password旧密码
    checkPwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'post',
            data: {
                userId,
                password
            }
        });
    },
    //修改密码，userId用户Id，password新密码
    updatePwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    }
}