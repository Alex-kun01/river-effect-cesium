/*
 * @Description: 用户信息
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-03-07 14:40:19
 * @LastEditors: yls
 * @LastEditTime: 2022-04-16 16:35:43
 */
import { defineStore } from 'pinia';
import { UserState } from './types';
import BaseConfig from '@/utils/defaultUtils/base';
import {
    getInfo,
    login,
    LoginData,
    userLogout
} from '@/api/defaultApi/login';

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userName: '',
        nickName: '',
        phone: '',
        token: '',
        codeId: '',
        email: '',
        id: '',
        lastLoginTime: ''
    }),
    actions: {
        // 设置用户的信息
        setInfo(data:UserState) {
            this.$patch(data);
        },
        // 重置用户信息
        resetInfo() {
            this.$reset();
        },
        // 获取用户信息
        async info() {
            const result = await getInfo();
            this.setInfo(result.data);
        },
        // 登录用户信息
        async login(loginForm: LoginData) {
            const result:any = await login(loginForm);
            const code = result?.code;
            switch (code) {
                // 登录成功存储token,获取用户信息
                case 200:
                    localStorage.setItem('ACCESS_TOKEN', result.data);
                    this.info();
                    break;
                // 登录不成功更新验证码
                case 500:
                    new BaseConfig();
                    break;
                default:
                    break;
            }
            return result;
        },
        // 退出登录
        async logout() {
            await userLogout();
            this.resetInfo();
            localStorage.setItem('ACCESS_TOKEN', '');
        }
    }
});
