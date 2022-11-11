/*
 * @Description:
 * @Author: Suwenqi
 * @Date: 2022-03-08 10:41:38
 * @LastEditTime: 2022-05-10 13:56:23
 * @LastEditors: hasaiki
 */
import {
    createRouter, createWebHistory, RouteRecordRaw
} from 'vue-router';


// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
    path: '/:catchAll(.*)',
    redirect: '/404',
    hidden: true
};

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue') // 建议进行路由懒加载，优化访问性能
    },
    {
        'name': '404',
        'path': '/404',
        'meta': {
            'title': '访问异常',
            'show': false,
            'titleVisible': false
        },
        component: () => import('@/views/404.vue')
    }, notFoundRouter
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
