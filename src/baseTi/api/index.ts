/*
 * @Description:
 * @Version: 1.0
 * @Autor: lxy
 * @Date: 2022-06-07 10:36:56
 * @LastEditors: lxy
 * @LastEditTime: 2022-06-07 10:36:56
 */
/*
 * @Description:
 * @Author: wanglu
 * @Date: 2022-03-01 14:48:27
 */
import request from '@/api/request';
import axios from 'axios';

/**
* @description: 获取启用资源文件 thingjs uearth等js资源
*/

export function xxvWebAssetsList() {
    return request({
        url: '/basex/webAssets/xxvWebAssetsList',
        method: 'get'
    });
}

/**
 *
 * @description 获取xxv前端config配置表
 */

export function sysConfig() {
    return request({
        url: '/basex/sysConfig/loadXxvConfigs',
        method: 'get'
    });
}

/**
* @description: 获取场景列表
*/

export function getScene(parameter: any) {
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
 *
 * @description 获取全部自定义视角数据
 */

export function getViewList(params: any) {
    return request({
        url: '/gateway/basex/scene/layerCamInfo',
        method: 'get',
        params
    });
}

/**
 *
 * @description 保存自定义视角数据
 */

export function saveView(param: any) {
    return request({
        url: '/gateway/basex/scene/scene/saveCamConfig',
        method: 'post',
        data: param
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
export function saveSceneCamConfig(param: any) {
    return request({
        url: '/basex/scene/saveCamConfig',
        method: 'post',
        data: param
    });
}

/**
 *
 * @description 查询设备范围内其他设备列表信息
 */

export function getLinkDevice(params: any) {
    return request({
        // eslint-disable-next-line max-len
        url: `/basex/TwinBodyData/getTwinDataScope?originPosition=${params.originPosition1}&originPosition=${params.originPosition2}&originPosition=${params.originPosition3}&sceneId=${params.sceneId}&targetTwinClassIds=${params.targetTwinClassIds}&parentId=${params.parentId}&radius=${params.radius}`,
        method: 'get'
    });
}

/**
* @description: 初始化设备获取该场景所有点位信息
*/

export function queryTwinDataBySceneId(params: any) {
    return request({
        url: '/basex/TwinBodyData/getTwinBodyDataBySceneId',
        method: 'get',
        params
    });
}

/**
 *
 * @description 获取底部菜单栏
 */

export function sysMenu() {
    return request({
        url: '/basex/sysMenu/XXV',
        method: 'get'
    });
}


/**
* @description 登录登出
*/
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
export function login(parameter: LoginData) {
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

/**
* @description: 退出登录
*/

export function userLogout() {
    return request({
        url: Api.Logout,
        method: 'delete',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
}

/*
apijson请求
*/
/**
 * @description 查询孪生体数据
 * @param {Object} data 参数参照apijson语法
 * @return {*}
 */
export function getJsonData<T>(data: T) {
    return request({
        url: '/jrmx/get',
        method: 'post',
        data
    });
}

/**
* @description: 删除数据
*/

export function deleteJsonData(data?: any) {
    return request({
        url: '/jrmx/delete',
        method: 'post',
        data
    });
}

/**
* @description: 新增数据
*/

export function insertJsonData(data?: any) {
    return request({
        url: '/jrmx/post',
        method: 'post',
        data
    });
}

/**
* @description: 更新数据
*/

export function updataTwinData(data?: any) {
    return request({
        url: '/jrmx/put',
        method: 'post',
        data
    });
}

/**
 * @description : 获取业务字典
 * @param {*}
 */

export function getMappingList(parameter?: object) {
    return request({
        url: '/basex/dictType/dropDown',
        method: 'get',
        params: parameter
    });
}

/**
* @description:获取basex开发字典
* @param {parameter}
*/

export function sysDictTypeDropDown(parameter?: object) {
    return request({
        url: '/basex/sysDictType/dropDown',
        method: 'get',
        params: parameter
    });
}

/**
* @description 保存操作日志
* @author hasaiki
* @date 2022/03/07
* @export
* @param {*} param
* @return {*}
*/
export function saveLog(param: any) {
    return request({
        url: '/basex/sysOpLog/record',
        method: 'post',
        data: param
    });
}

/**
* @Description: 获取告警等级
* @Param  {object} parameter: 参数
* @Return {any}
*/
export function alarmLevelList(parameter?: object): any {
    return request({
        url: '/basex/alert/level/list',
        method: 'get',
        params: parameter
    });
}

/**
 * @description 获取瓦片地址列表
 * @param {Object} params
 * @return {*}
 */
export function queryMapTileList<T>(params?: T) {
    return request({
        url: '/basex/sysMapSource/list',
        method: 'get',
        params
    });
}

/**
* @description: 获取地图视角信息
*/

export function getMapCamList() {
    return request({
        url: '/basex/sysMapSource/list',
        method: 'get'
    });
}

/**
 * @description 获取天气信息
 */

export function getWeatherInfo(citycode: (string | number)) {
    return new Promise((resolve, reject) => {
        axios.get(`http://wthrcdn.etouch.cn/weather_mini?citykey=${citycode}`).then(res => {
            if (res.data.status === 1000) {
                resolve(res.data.data);
            } else {
                reject(res);
            }
        });
    });
}
/**
 * @description 获取图例
 */

export function getLegendMenu(params?: object) {
    return request({
        url: '/basex/legend/select',
        method: 'get',
        params
    });
}
/**
 * @description 根据图例获取孪生体
 */

export function getSelectTwin(params?: object) {
    return request({
        url: '/basex/legend/selectTwin',
        method: 'get',
        params
    });
}
