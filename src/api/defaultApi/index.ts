/*
 * @Description:
 * @Author: wanglu
 * @Date: 2022-03-01 14:48:27
 */
import request from '@/utils/defaultUtils/request';
import axios from 'axios';

// 返回已经上传的场景列表。
export function sceneList(parameter:any) {
    return request({
        url: '/gateway/basex/scene/scene/list',
        method: 'get',
        params: parameter
    });
}
// 获取园区
export function getSceneInfo(param:any) {
    return request({
        url: '/gateway/basex/scene/scene/plus/tree',
        method: 'get',
        params: param
    });
}
// 获取全部自定义视角数据
export function getViewList(params:any) {
    return request({
        url: '/gateway/basex/scene/layerCamInfo',
        method: 'get',
        params
    });
}

// 初始化设备
export function getAllPointInfo(params:any) {
    return request({
        url: '/gateway/basex/TwinBodyData/getTwinBodyDataBySceneId',
        method: 'get',
        params
    });
}

// 保存自定义视角数据
export function saveView(param:any) {
    return request({
        url: '/gateway/basex/scene/scene/saveCamConfig',
        method: 'post',
        data: param
    });
}
// 查询设备范围内其他设备列表信息
export function getLinkDevice(params:any) {
    return request({
        // eslint-disable-next-line max-len
        url: `/basex/TwinBodyData/getTwinDataScope?originPosition=${params.originPosition1}&originPosition=${params.originPosition2}&originPosition=${params.originPosition3}&sceneId=${params.sceneId}&targetTwinClassIds=${params.targetTwinClassIds}&parentId=${params.parentId}&radius=${params.radius}`,
        method: 'get'
    });
}

/**
 * @description 查询孪生体数据
 * @param {Object} data 参数参照apijson语法
 * @return {*}
 */
export function queryTwinDataList<T>(data:T) {
    return request({
        url: '/jrmx/get',
        method: 'post',
        data
    });
}

/**
 * @description 获取指定场景下的孪生体点位信息列表
 * @param {Object} params
 * @param {String} params.sceneId 场景id 必填
 * @param {String} params.dataSources 数据来源，包括TWIN, ASSET, ASSET_IMPORT, MMD, CAD, GIS
 * @param {String} params.parentId 物体id
 * @param {String} params.twinClassIds 孪生对象id列表
 * @param {String} params.onlyMine 只查询我的点位
 * @param {String} params.ignoreKeys 忽略的结果列
 * @return {*}
 */
export function queryTwinDataBySceneId<T>(params:T) {
    return request({
        url: '/basex/TwinBodyData/getTwinBodyDataBySceneId',
        method: 'get',
        params
    });
}

// 获取底部菜单栏
export function sysMenu() {
    return request({
        url: '/basex/sysMenu/XXV',
        method: 'get'
    });
}
// 获取config配置表
export function sysConfig() {
    return request({
        url: '/basex/sysConfig/loadXxvConfigs',
        method: 'get'
    });
}


// 获取地图视角信息
export function getMapCamList() {
    return request({
        url: '/basex/sysMapSource/list',
        method: 'get'
    });
}

/**
 * @description 获取天气信息
 */

export function getWeatherInfo(citycode:(string | number)) {
    return new Promise((resolve, reject)=>{
        axios.get(`http://wthrcdn.etouch.cn/weather_mini?citykey=${citycode}`).then(res=>{
            if (res.data.status === 1000) {
                resolve(res.data.data);
            } else {
                reject(res);
            }
        });
    });
}
