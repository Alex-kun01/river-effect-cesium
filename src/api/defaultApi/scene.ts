/*
 * @Author: your name
 * @Date: 2022-03-06 15:03:00
 * @LastEditTime: 2022-04-14 17:47:50
 * @LastEditors: yls
 * @Description: 获取基本数据接口
 */
import request from '@/utils/defaultUtils/request';

/**
 * @description 获取瓦片地址列表
 * @param {Object} params
 * @return {*}
 */
 export function queryMapTileList<T>(params?:T) {
    return request({
        url: '/basex/sysMapSource/list',
        method: 'get',
        params
    });
}

/**
 * @description: 获取场景列表
 */
export function getScene(parameter:any) {
    return request({
        url: 'basex/scene/scene/plus/tree',
        method: 'get',
        params: parameter
    });
}

/**
 * @description: 获取已启用的场景列表
 */
export function getSceneList() {
    return request({
        url: '/basex/scene/scene/list',
        method: 'get'
    });
}


/**
 * @description: 获取启用资源文件
 */
export function xxvWebAssetsList() {
    return request({
        url: '/basex/webAssets/xxvWebAssetsList',
        method: 'get'
    });
}
/**
 * @description 保存场景层级视角
 * @author hasaiki
 * @date 2022/03/04
 * @export
 * @param {*} param
 * @return {*} 请求函数
 */
export function saveSceneCamConfig(param:any) {
    return request({
        url: '/basex/scene/saveCamConfig',
        method: 'post',
        data: param
    });
}
/**
 * @description: 初始化设备
 */
export function getAllPointInfo(params: any) {
    return request({
        url: '/basex/TwinBodyData/getTwinBodyDataBySceneId',
        method: 'get',
        params
    });
}
