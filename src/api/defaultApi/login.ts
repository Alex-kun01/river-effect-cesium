// eslint-disable-next-line
import request from '@/utils/defaultUtils/request';

enum Api {
    Login = '/basex/login',
    code = '/code',
    Logout = '/basex/logout',
    getLoginUser = '/basex/getLoginUser'
};

/**
 * @description: 登录
 * @param {any} parameter 参数
 */

export interface LoginData {
    account: string;
    code: string | number;
    password: string;
    uuid: string;
}
export function login(parameter:LoginData) {
    return request({
        url: Api.Login,
        method: 'post',
        data: parameter
    });
}

export function getCaptchaImage() {
    return request({
        url: Api.code,
        method: 'get'
    });
}

/**
 * @description: 获取信息
 * @param {*}
 */

export function getInfo() {
    return request({
        url: Api.getLoginUser,
        method: 'get'
    });
}


export function userLogout() {
    return request({
        url: Api.Logout,
        method: 'delete',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
}


