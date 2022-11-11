/*
 * @Description:
 * @Author: Suwenqi
 * @Date: 2022-03-13 15:45:12
 * @LastEditTime: 2022-06-07 11:31:32
 * @LastEditors: lxy
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import axios from 'axios';
import 'ant-design-vue/dist/antd.css';
import { createPinia } from 'pinia';
import './global';
// 创建 Pinia 实例
const pinia = createPinia();
// import ScreenAdapter from './utils/defaultUtils/ScreenAdapter';
// 项目屏幕自适应配置
// const sa = new ScreenAdapter(1920, 1080, '#fff');
// sa.init();
// 项目是否拥有登录页面,有登录页面就不需要请求万能token，没有登录页面就需要请求万能token
// fase是不需要登录(不会请求登录信息)，true需要登录
const isLogin = false;

const initT = ()=>{
    const app = createApp(App).use(router).use(pinia).mount('#app');
    window.$vm= {};
    window.$vm.vue = app;
};

if (isLogin) {
    initT();
} else {
    const tenan = window.config.tenantCode || 'master';
    localStorage.setItem('TENANT_CODE', tenan);
    axios.get(`${window.config.appApi}/basex/sysConfig/loadXxvConfigs`, { headers: {
        Tenant: tenan
    } }).then((res) =>{
        window.configXxv = res.data.data;
        localStorage.setItem('ACCESS_TOKEN', res.data.data.WAN_NENG_TOKEN);
        initT();
    });
}

