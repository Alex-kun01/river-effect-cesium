/*
 * @Author: 'luxiaoyao' 'luxiaoyao@uino.com'
 * @Date: 2022-05-27 10:26:25
 * @LastEditors: 'luxiaoyao' 'luxiaoyao@uino.com'
 * @LastEditTime: 2022-05-30 09:51:56
 * @FilePath: \xxv-cli\src\store\defaultStore\user\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';
import { UserState } from './types';
import BaseConfig from '@/baseTi/utils/base';
import {
    getInfo,
    login,
    LoginData,
    userLogout
} from '@/baseTi/api';

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
        setInfo(data: UserState) {
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
            const result: any = await login(loginForm);
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
