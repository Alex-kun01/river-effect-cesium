/*
 * @Description:
 * @Version: 1.0
 * @Autor: lxy
 * @Date: 2022-06-07 11:12:56
 * @LastEditors: lxy
 * @LastEditTime: 2022-06-07 11:12:57
 */
import axios from 'axios';
import { notification } from 'ant-design-vue'; // es/notification
import router from '@/router/index';

let refusing = false; // 标识某个时间段只允许提示一次错误信息
const CODE = {
    TIPS: '提示',
    SERVER: '服务器异常',
    ERROR: '错误'
};

// 异常拦截处理器
const errorHandler = async (error:any)=> {
    const tip = !error.response.config.noTip;
    if (error.response.data.code === 429) {
        notification.error({
            message: CODE.ERROR,
            description: '操作过快 请稍后再试'
        });
    }
    if (error.response && !refusing) {
        refusing = true;
        const data = error.response.data;
        // 从 localstorage 获取 token
        const token =localStorage.getItem('ACCESS_TOKEN');
        // 错误的接口请求
        if (tip && error.response.status === 400) {
            if (error.request.responseType === 'blob') {
                notification.error({
                    message: CODE.TIPS,
                    description: '下载资源未找到！'
                });
            } else {
                notification.error({
                    message: CODE.TIPS,
                    description: data.message
                });
            }
        }
        // 没有权限访问接口: 未授权、token为空、不合法、已失效等
        if (error.response.status === 401) {
            const code = (data.code + '').substring(0, 6);
            if (401201 === parseInt(code)) {
                if (tip && token) {
                    notification.error({
                        message: CODE.TIPS,
                        description: data.message
                    });
                }
                // 主租户 产品未授权
                if (4012010 === parseInt(data.code)) {
                    // 登出并跳转制定页面,提示授权
                    await router.push({ name: '404' });
                } else if (4012011 === parseInt(data.code)) {
                    // 非主租户 租户未授权
                    // 删除登录信息跳转到指定页面
                    await router.push({ name: '404' });
                }
            }

            if (401102 === parseInt(code) && tip) {
                notification.error({
                    message: CODE.TIPS,
                    description: data.message
                });
            }
        }
        // 接口不存在
        if (error.response.status === 404) {
            if (tip) {
                notification.error({
                    message: CODE.TIPS,
                    description: '接口未找到'
                });
            }
        }
        // 接口定义不合法
        if (error.response.status === 403) {
            if (tip) {
                notification.error({
                    message: CODE.TIPS,
                    description: data.message
                });
            }
        }
        // 后台错误统一提示
        if (error.response.status === 500 ||
        error.response.status === 501 ||
        error.response.status === 502 ||
        error.response.status === 503 ||
        error.response.status === 504) {
            if (tip) {
                notification.error({
                    message: CODE.TIPS,
                    description: '服务器异常,小锘马上维修'
                    // description: `${data.message}`
                });
            }
        }
        // 重置标识
        setTimeout(() => {
            refusing = false;
        }, 1000);
    }
    return Promise.reject(error.response.data ? error.response.data : { message: '网络异常' });
};
    // 创建 axios 实例
const service = axios.create({
    baseURL: window.config.appApi, // 暂用basex的开发环境测试
    timeout: 6000 // 请求超时时间
});
service.interceptors.request.use((config:any) => {
    const configT = config;
    // if (configT.isMock) {
    //     configT.baseURL = '/api';
    // } else if (configT.baseURL) {
    //     configT.baseURL = configT.baseURL;
    // } else {
    //     configT.baseURL = `${window.config.appApi}`;
    // }
    const token = localStorage.getItem('ACCESS_TOKEN');
    const tenant = localStorage.getItem('TENANT_CODE');
    if (token) {
        configT.isMock ? (configT.headers['Access-Token'] = '4291d7da9005377ec9aec4a71ea837f') : (configT.headers['Authorization'] = 'Bearer ' + token);
    }
    if (tenant) {
        configT.headers['Tenant'] = tenant;
    }
    return configT;
}, errorHandler);
// 返回拦截
service.interceptors.response.use(response => {
    if (response.request.responseType === 'blob') {
        return response;
    }
    const resData = response.data;
    // token刷新
    const token = response.headers['authorization'];
    if (token) {
        localStorage.setItem('ACCESS_TOKEN', token);
    }
    return resData;
}, errorHandler);
const install = function(app:any) {
    app.config.globalProperties.$axios = service;
};
export default service;
export { install as VueAxios, service as axios };
