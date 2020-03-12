/**
 * 
 * 路由权限拦截
 */
import router from './router/index.js';
import {
    getUserInfo
} from "./api/login.js";
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('vue-msm-token');
    //判断token
    if (!token) {
        //token不存在
        //判断访问路径
        if (to.path !== '/login') {
            //访问非login 界面，都跳转到login界面
            next({
                path: '/login'
            });
        } else {
            //访问login 界面, 直接跳转
            next();
        }
    } else {

        //token存在
        const user = localStorage.getItem('vue-msm-user');
        //本地用户数据是否存在
        if (user) {
            //存在,直接跳转
            next();
        } else {
            //不存在
            //通过token 获取后台在线数据\
            getUserInfo(token).then(response => {
                const resp = response.data;
                if (resp.flag) {
                    //获取用户信息成功
                    localStorage.setItem(
                        "vue-msm-user",
                        JSON.stringify(resp.data)
                    );
                    localStorage.setItem("vue-msm-token", token);
                    //跳转
                    next();
                } else {
                    //获取用户信息失败
                    //判断访问路径
                    if (to.path !== '/login') {
                        //访问非login 界面，都跳转到login界面
                        next({
                            path: '/login'
                        });
                    } else {
                        //访问login 界面, 直接跳转
                        next();
                    }
                }
            });


        }
    }

})