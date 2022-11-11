/*
 * @Description:
 * @Author: Suwenqi
 * @Date: 2022-03-04 17:40:32
 * @LastEditTime: 2022-04-14 17:58:20
 * @LastEditors: yls
 */
import request from '@/utils/defaultUtils/request';


/**
 * @description: 获取业务字典
 */
export function getMappingList(parameter?:object) {
    return request({
        url: '/basex/dictType/dropDown',
        method: 'get',
        params: parameter
    });
}

/**
 * @description:获取basex开发字典
 */
export function sysDictTypeDropDown(parameter?:object) {
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
 export function saveLog(param:any) {
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
 export function alarmLevelList(parameter?:object):any {
    return request({
        url: '/basex/alert/level/list',
        method: 'get',
        params: parameter
    });
}