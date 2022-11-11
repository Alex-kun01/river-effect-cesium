/*
 * @Description: 封装apijson请求
 * @Author: Suwenqi
 * @Date: 2022-03-10 10:58:19
 * @LastEditTime: 2022-03-10 10:59:25
 * @LastEditors: Suwenqi
 */
import request from '@/utils/defaultUtils/request';

// 查询数据
export function getJsonData(data?:any) {
    return request({
        url: '/jrmx/get',
        method: 'post',
        data
    });
}


// 删除数据
export function deleteJsonData(data?:any) {
    return request({
        url: '/jrmx/delete',
        method: 'post',
        data
    });
}


// 新增数据
export function insertJsonData(data?:any) {
    return request({
        url: '/jrmx/post',
        method: 'post',
        data
    });
}

// 更新数据
export function updataTwinData(data?:any) {
    return request({
        url: '/jrmx/put',
        method: 'post',
        data
    });
}
