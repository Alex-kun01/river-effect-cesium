import { resolve } from 'path';
/*
 * @Description: 告警封装
 * @Author: Suwenqi
 * @Date: 2022-03-09 15:24:55
 * @LastEditTime: 2022-04-16 14:02:11
 * @LastEditors: yls
 */
import { getJsonData } from '@/api/defaultApi/apiJson';
import { sysDictTypeDropDown, alarmLevelList } from '@/api/defaultApi/dictType';
import { dateFormat, groupArrayByKey } from '@/utils/defaultUtils/utils';
// 告警列表分页
interface Page{
    open: boolean,
    pageNo?:number,
    pageSize?: number,
    totalRows?:number,
}
// 排序
interface Order{
    field: string,
    sort?:string,
}
// 历史告警
interface HistoryAlarm{
    open: boolean,
    startTime?:Date,
    endTime?:Date,
}

// 告警等级对象封装
interface AlarmLevel{
    levelCode:string,
    levelColor:string,
    levelName:string,
    remark?:string
}
// 告警状态对象封装
interface AlarmStatus{
    code:string,
    value:string,
}
// 模糊查询
interface SerchObj{
    open:boolean,
    fields?:Array<string>,
    serchValue?:string | Date |'',
}
// 获取告警数据配置项
interface AlarmConfig {
    // xxv菜单编码
    xxvMenuCode?:string,
    // 孪生体分类编码
    twinClassesCode?:string,
    // basex告警级别
    basexAlarmLevel?:Array<string>,
    // xxv告警级别
    xxvAlarmLevel?:Array<string>,
    // 告警状态
    alarmStatus?:Array<string>,
    // 获取历史告警数据
    history?:HistoryAlarm,
    // 排序字段（允许【createTime、externalCreateTime、level、convertLevel、twinCode、processUser、deviceName】这些字段排序）
    order?:Order,
    // 获取最新几条告警
    topNum?:number,
    // 孪生体编码（设备编码）
    twinCode?:Array<string>,
    // 分页
    page?:Page,
    // 建筑Id 【所属建筑】
    buildingId?:string,
    // 楼层Id 【所属楼层】
    floorId?:string,
    // 场景ID 【所属场景】
    sceneId?:string,
    // 园区层级
    campus?:boolean,
    // 模糊查询
    serch?:SerchObj

}

class Alarminfo {
    // 孪生体数据
    twinData?:object;
    // 告警接收时间
    createTime?:number;
    // 告警详情
    detail?:string;
    // 孪生体分类
    twinClass?:string;
    // 告警标题
    topic?:string;
    // id标识
    id?:string;
    // 系统告警级别
    level?:string;
    // basex系统告警
    basexLevel?:string;
    // 告警产生时间
    externalCreateTime?:number;
    // 孪生体对象数据ID标识
    twinUuid?:string;
    // 备注
    remark?:string;
    // 孪生体对象编码
    twinCode?:string;
    // 告警状态（字典）获取
    processStatus?:string;
    // 处理人
    processUser?:string;
    // 处理时间
    processDate?:number;
    // 是否是模拟告警 （1->真实告警，2-模拟告警，默认为1）
    fakeFlag?:number;
    // 设备名称
    deviceName?:string;
    // 第三方告警ID
    xxvAlertId?:string;
    // 告警等级数据
    alarmLevelInfo?:AlarmLevel;
    // 告警状态数据
    alarmStatusInfo?:AlarmStatus;
    constructor(option?:any) {
        const {
            twinData, deviceName, externalAlertId,
            processDate, fakeFlag, processUser, processStatus,
            externalAlertDeviceId, remark, twinUuid, externalCreateTime, convertLevel,
            level, topic, mappingCode, detail, createTime, alarmLevelInfo, alarmStatusInfo
        } = option;
        this.twinData=twinData;
        this.createTime=createTime;
        this.detail=detail;
        this.twinClass=mappingCode;
        this.topic=topic;
        this.level=level;
        this.basexLevel=convertLevel;
        this.externalCreateTime=externalCreateTime;
        this.twinUuid=twinUuid;
        this.remark=remark;
        this.twinCode=externalAlertDeviceId;
        this.processStatus=processStatus;
        this.processUser=processUser;
        this.processDate=processDate;
        this.fakeFlag=fakeFlag;
        this.xxvAlertId=externalAlertId;
        this.deviceName=deviceName;
        this.alarmLevelInfo=alarmLevelInfo;
        this.alarmStatusInfo=alarmStatusInfo;
    }
}

const alarminfoKeyMapping:any={
    'createTime': 'create_time',
    'detail': 'detail',
    'twinClassesCode': 'mapping_code',
    'topic': 'topic',
    'xxvAlarmLevel': 'level',
    'basexAlarmLevel': 'convert_level',
    'externalCreateTime': 'external_create_time',
    'twinUuid': 'twin_uuid',
    'remark': 'remark',
    'twinCode': 'external_alert_device_id',
    'processStatus': 'process_status',
    'processUser': 'process_user',
    'processDate': 'process_date',
    'fakeFlag': 'fake_flag',
    'xxvAlertId': 'external_alert_id',
    'deviceName': 'device_name'
};
const canSearchFields = ['basexAlarmLevel', 'xxvAlarmLevel', 'detail', 'topic', 'externalCreateTime', 'processStatus', 'twinClassesCode', 'twinCode', 'xxvAlertId', 'processUser'];
const alarmFieldMapping:any={
    'createTime': 'create_time',
    'externalCreateTime': 'external_create_time',
    'level': 'level',
    'convertLevel': 'convert_level',
    'twinCode': 'twin_uuid',
    'processUser': 'process_user',
    'deviceName': 'device_name'
};
let alarmLevels:Array<AlarmLevel> =[];
let alarmStatusList:Array<AlarmStatus> =[];

/**
 * @Description:根据入参配置，获取告警数据
 * @Param  {AlarmConfig} option:入参
 * @Return {Promise}
 */
export function getAlarmData(option:AlarmConfig) {
    return new Promise(async (resolve:any, reject:any)=>{
        try {
            const res:any = await getQueryData(option);
            if (res.ok) {
                // 封装返回数据
                const resultData:any = getReturnData(option, res);
                resolve(resultData);
            } else {
                resolve([]);
            }
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * @Description: 处理入参配置，查询数据,没有配置默认查询全部告警
 * @Param  {AlarmConfig} option:入参
 * @Return {Promise} Promise 查询数据
 */
function getQueryData(option:AlarmConfig) {
    return new Promise(async (resolve:any, reject:any)=>{
        try {
            await getCommonData();
            // 获取告警等级数据
            const { twinClassesCode } = option;
            if (twinClassesCode === 'DEFAULT') {
                // eslint-disable-next-line prefer-promise-reject-errors
                throw new Error(`不支持【${twinClassesCode}】孪生体查询`);
            }
            // 第一个维度 history(历史告警)、topNum(最新告警)
            const condition1:any = handleHistoryOrTopList(option);
            const { queryCondition, mainKey } = condition1;
            // 第二纬度其他普通条件
            const condition2:any =await handleQueryCondition2(option, mainKey);
            // 合并对象
            const deviceAlertTempObj = { ...queryCondition['[]'][mainKey], ...condition2[mainKey] };
            queryCondition['[]'] = { ...queryCondition['[]'], ...condition2 };
            queryCondition['[]'][mainKey] = deviceAlertTempObj;
            // 第三维度 模糊查询处理
            const conditionRes:any =await handleSearchCondition(option, mainKey, queryCondition);
            // 合并对象
            // const tempObj = { ...queryCondition['[]'][mainKey], ...condition3[mainKey] };
            // queryCondition['[]'] = { ...queryCondition['[]'], ...condition3 };
            // queryCondition['[]'][mainKey] = tempObj;
            const res:any = await getJsonData(conditionRes);
            // 带孪生体数据的集合
            const dataRes:Array<object> = [];
            // 返回集
            const resultData:any = {};
            // 带着孪生体数据信息
            if ( res.code === 200) {
                if (res['[]']) {
                    const tempArr:Array<any> = handleApijsonData(res['[]'], mainKey);
                    if (tempArr.length === 0) {
                        throw new Error('查询条件格式不正确，请检查！');
                    }
                    // 没有指定孪生体编码
                    if (!twinClassesCode) {
                        const {
                            buildingId, floorId, campus, sceneId
                        } = option;
                        // 处理第一次请求到的数据
                        // 以孪生体编码分类
                        const groupedArr:any = groupArrayByKey({ data: tempArr, key: 'mapping_code' });
                        for (const k in groupedArr) {
                            const classCode:string = k;
                            if (classCode === 'DEFAULT') {
                                continue;
                            }
                            const thisTwinIds:Array<string>=[];
                            const item:any = groupedArr[k];
                            item.forEach((element:any) => {
                                thisTwinIds.push(element.external_alert_device_id);
                            });
                            const thisTwinData:any = await queryEquipmentData(classCode, { twinIds: thisTwinIds, buildingId, floorId, campus, sceneId });
                            // 组装数据
                            item.forEach((it:any)=>{
                                const temp:any = thisTwinData.find((twinData:any)=>twinData[classCode].UniqueCode === it.external_alert_device_id);
                                if (temp) {
                                    dataRes.push({ ...{ twinData: temp[classCode], ...it } });
                                }
                            });
                        }
                        // 最后纬度 分页和排序(暂定前端分页)
                        const condition3 = orderAndPageByFloor(dataRes, option);
                        // 组装数据
                        resultData.data = condition3.data;
                        resultData.info ={
                            count: condition3.pageSize,
                            page: condition3.pageNo,
                            total: condition3.total
                        };
                        resultData.ok = res.ok;
                    } else {
                        // 入参存在孪生体编码直接添加第三维度
                        const thisTwinIds:Array<string>=[];
                        const externalAlertId:Array<string>=[];
                        tempArr.forEach((item:any)=>{
                            thisTwinIds.push(item.external_alert_device_id);
                            externalAlertId.push(item.external_alert_id);
                        });
                        // 最后纬度 分页和排序
                        const requestObj={
                            '[]': {
                                'join': `>/${twinClassesCode}/uuid@`,
                                [mainKey]: {
                                    'external_alert_id{}': externalAlertId
                                },
                                [twinClassesCode]: {
                                    'uuid@': `/${mainKey}/twin_uuid`,
                                    'UniqueCode{}': thisTwinIds
                                },
                                'page': 0,
                                'count': 10,
                                'query': 2
                            },
                            'total@': '/[]/total',
                            'info@': '/[]/info'
                        };
                        const condition3 = handleOrderAndPageCondition(option, mainKey);
                        const deviceAlertTempObj = { ...requestObj['[]'][mainKey], ...condition3[mainKey] };
                        requestObj['[]'] = { ...requestObj['[]'], ...condition3 };
                        requestObj['[]'][mainKey] = deviceAlertTempObj;
                        const thisTwinData:any = await getJsonData(requestObj);
                        const thisData:Array<object> = [];
                        // 统一数据结构以便处理
                        thisTwinData['[]'].forEach((element:any) => {
                            const twinData = element[twinClassesCode];
                            thisData.push({ ...element[mainKey], ...{ twinData } });
                        });
                        resultData.data =thisData;
                        resultData.info = thisTwinData['info'];
                        resultData.ok = thisTwinData['ok'];
                    }
                }
            } else {
                throw new Error('apijson请求失败，请查看！');
            }
            resolve(resultData);
        } catch (e) {
            return reject(e);
        }
    });
}

/**
 * @Description:处理模糊查询的入参
 * @Param  {Object} option:入参
 * @Param  {string} mainKey:主表
 * @Param  {any} queryCondition:查询条件
 * @Return {Object} requestObj:apijson请求数据格式对象
 */
function handleSearchCondition(option:AlarmConfig, mainKey:string, queryCondition:any) {
    function handleDicData(field:string, serchStr:string) {
        let res:string = serchStr;
        if (['basexAlarmLevel', 'processStatus'].includes(field)) {
            if (field==='basexAlarmLevel') {
                const find = alarmLevels.find((it:AlarmLevel)=>it.levelName.indexOf(serchStr) != -1 || it.levelCode.indexOf(serchStr) != -1);
                if (find) {
                    res = find.levelCode;
                }
            } else if (field==='processStatus') {
                const find = alarmStatusList.find((it:any)=>it.value.indexOf(serchStr) != -1 || it.code.indexOf(serchStr) != -1);
                if (find) {
                    res = find.code;
                }
            }
        }
        return res;
    }
    return new Promise(async (resolve:any)=>{
        const { serch } = option;
        const condition:any = JSON.parse(JSON.stringify(queryCondition));
        const requestObj = condition['[]'];
        // 模糊查询默认字段【告警内容，告警标题，告警等级】(detail,topic,basexAlarmLevel)
        const DEFAULT_SERCH_FIELDS = ['detail', 'topic', 'basexAlarmLevel'];
        let serchFields :Array<string> =DEFAULT_SERCH_FIELDS;
        const fieldsTemp:Array<string> = [];
        if (serch && serch.open && serch.serchValue) {
            const serchStr:string = serch.serchValue instanceof Date ? dateFormat(serch.serchValue) : serch.serchValue;
            // 获取查询条件已经拼装的字段
            if (serch.fields?.length) {// 模糊查询指定字段
                serchFields = serch.fields;
            }
            serchFields.forEach( (element:string)=>{
                // 判断是否是允许模糊查询的字段
                if (!canSearchFields.includes(element)) {
                    return true;
                }
                // 处理字典字段
                // eslint-disable-next-line no-underscore-dangle
                const serchStr_:string = handleDicData(element, serchStr);
                // 获取映射字段
                const mappingField = alarminfoKeyMapping[element];
                if (mappingField) {
                    fieldsTemp.push(`${mappingField}$`);
                    if (requestObj[mainKey][`${mappingField}{}`]) {
                        delete requestObj[mainKey][`${mappingField}{}`];
                    }
                    requestObj[mainKey][`${mappingField}$`] = `%${serchStr_}%`;
                }
            });
            requestObj[mainKey]['@combine'] = fieldsTemp.join(',');
        }
        resolve(condition);
    });
}

/**
 * @Description:处理第二纬度的入参
 * @Param  {Object} option:入参
 * @Param  {string} mainKey:主表
 * @Return {Object} requestObj:apijson请求数据格式对象
 */
function handleQueryCondition2(option:AlarmConfig, mainKey:string) {
    return new Promise(async (resolve:any)=>{
        const {
            xxvMenuCode, twinClassesCode, alarmStatus, twinCode, buildingId, basexAlarmLevel, floorId, campus, xxvAlarmLevel, sceneId
        } = option;
        let requestObj:any = { [mainKey]: {} };
        let joinVal:string = '';
        // 组装第一纬度参数apijson请求的格式
        if (xxvMenuCode) {
            // 如果配置了xxv菜单
            joinVal+='</Twin_class/code@,&/Twin_xxv/twin_id@,';
            requestObj = {
                'join': joinVal,
                [mainKey]: {},
                'Twin_class': {
                    'code@': `/${mainKey}/mapping_code`
                },
                'Twin_xxv': {
                    'twin_id@': '/Twin_class/id',
                    '@column': 'twin_id;xxv_code',
                    'xxv_code': xxvMenuCode
                }
            };
        }
        if (alarmStatus &&alarmStatus.length>0) {
            // 获取告警状态字典配置
            const alarmStatuss:Array<string> = [];
            if (!(alarmStatusList && alarmStatusList.length > 0)) {
                await getCommonData('status');
            }
            alarmStatus.forEach((item:string)=>{
                const find = alarmStatusList.find((it:any)=>it.value === item || it.code === item);
                if (find) {
                    alarmStatuss.push(find.code);
                }
            });
            requestObj[mainKey]['process_status{}']=alarmStatuss;
        }
        if (basexAlarmLevel) {// convertLevel
            // 获取告警等级字典
            const basexAlarmLevels:Array<string> = [];
            if (!(alarmLevels && alarmLevels.length > 0)) {
                await getCommonData('level');
            }
            basexAlarmLevel.forEach((item:string)=>{
                const find = alarmLevels.find((it:AlarmLevel)=>it.levelName === item || it.levelCode === item);
                if (find) {
                    basexAlarmLevels.push(find.levelCode);
                }
            });
            requestObj[mainKey]['convert_level{}'] = basexAlarmLevels;
        }
        if (xxvAlarmLevel) {// level
            requestObj[mainKey]['level{}'] = xxvAlarmLevel;
        }
        if (twinCode) {
            requestObj[mainKey]['external_alert_device_id{}']=twinCode;
        }
        if (sceneId) {
            requestObj[mainKey]['twin_scene_id']=sceneId;
        }
        if (twinClassesCode) {
            requestObj[mainKey]['mapping_code']=twinClassesCode;
            joinVal+=`>/${twinClassesCode}/uuid@,`;
            if (!requestObj[twinClassesCode]) {
                requestObj[twinClassesCode] = {};
            }
            requestObj[twinClassesCode]['uuid@']=`/${mainKey}/twin_uuid`;
            requestObj.join = joinVal;
        }

        if (buildingId && twinClassesCode) {
            if (!requestObj[twinClassesCode]) {
                requestObj[twinClassesCode] = {};
            }
            requestObj[twinClassesCode]['cb_building_id']=buildingId;
        }

        if (floorId && twinClassesCode) {
            if (!requestObj[twinClassesCode]) {
                requestObj[twinClassesCode] = {};
            }
            requestObj[twinClassesCode]['cb_floor_id']=floorId;
        }

        if (campus && sceneId && twinClassesCode) {
            if (!requestObj[twinClassesCode]) {
                requestObj[twinClassesCode] = {};
            }
            requestObj[twinClassesCode]['parent_id']=0;
            requestObj[twinClassesCode]['scene_id']=sceneId;
        }
        resolve(requestObj);
    });
}


/**
 * @Description:处理第一纬度的入参（历史/最新告警）
 * @Param  {Object} option:入参
 * @Return {Object} requestObj:apijson请求数据格式对象
 */
function handleHistoryOrTopList(option:AlarmConfig) {
    const { history, topNum } = option;
    const queryCondition:any = {
        '[]': {
        },
        // '@explain': true,
        'total@': '/[]/total',
        'info@': '/[]/info'
    };
    let mainKey:string = '';
    const requestObj:any = queryCondition['[]'];
    // 历史告警
    if (history && history.open) {
        mainKey='Device_alert_history';
        requestObj[mainKey]= {};
        // 获取时间段
        if (history.startTime&& history.endTime) {
            const start = dateFormat(history.startTime );
            const end = dateFormat(history.endTime );
            requestObj.Device_alert_history['external_create_time%'] = `${start},${end}`;
        }
    } else {
        mainKey='Device_alert';
        requestObj[mainKey]= {};
        if (topNum) {
            // 最新告警
            requestObj.count = topNum;
            requestObj.page = 0;
            requestObj.Device_alert['@order'] = 'external_create_time-';
        }
    }
    return { queryCondition, mainKey };
}


/**
 * @Description: 多孪生体分类查询下前端分页
 * @Param  {Array} data: 需要分页的数据
 * @Param  {Object} option:入参
 * @Return {Object}
 */
function orderAndPageByFloor(data:Array<object>, option:AlarmConfig) {
    const { page, order } = option;
    let arr:Array<object> = data;
    const res:any = {
        page: false,
        pageNo: 1,
        pageSize: 10
    };
    // 排序
    if (order && alarmFieldMapping[order.field]) {
        // 排序字段
        const orderVal:string = alarmFieldMapping[order.field];
        const sortVal = order.sort && order.sort === ('-' || 'DESC' || 'desc') ? '-' : '+';
        if (sortVal === '-') {
            arr.sort((A:any, B:any)=>{
                if (A[orderVal] > B[orderVal]) {
                    return -1;
                } else if (A[orderVal] < B[orderVal]) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            arr.sort((A:any, B:any)=>{
                if (A[orderVal] > B[orderVal]) {
                    return 1;
                } else if (A[orderVal] < B[orderVal]) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
    }
    // 分页
    if (page && page.open) {
        const { pageSize, pageNo } = page;
        // eslint-disable-next-line no-underscore-dangle
        const pageSize_ = pageSize || 10;
        // eslint-disable-next-line no-underscore-dangle
        const pageNo_ = pageNo || 1;
        // 首先按顺序以pageSize分为二维数组
        const dataArr = [];
        const maxPage = Math.ceil(arr.length / pageSize_);
        for (let i = 0; i<maxPage; i+=pageSize_) {
            dataArr.push(arr.slice(i, i+pageSize_));
        }
        arr = dataArr[pageNo_-1];
        res.page = true;
        res.pageNo = pageNo_;
        res.pageSize = pageSize_;
    }
    res.data = arr;
    res.total = data.length;
    return res;
}

/**
 * @Description:处理最后纬度的入参（分页和排序）
 * @Param  {Object} option:入参
 * @Param  {string} mainKey:主表值
 * @Return {Object} requestObj:apijson请求数据格式对象
 */
function handleOrderAndPageCondition(option:AlarmConfig, mainKey:string) {
    const requestObj:any = {};
    const {
        page, order, topNum
    } = option;
    // 分页
    if (page && page.open) {
        // eslint-disable-next-line no-underscore-dangle
        const pageNo_ = page.pageNo || 1;
        // eslint-disable-next-line no-underscore-dangle
        const pageSize_ = page.pageSize || 10;
        requestObj.page = pageNo_-1;
        requestObj.count = pageSize_;
    }
    if (topNum) {
        requestObj.count = topNum;
    }
    // 排序(默认升序)
    if (order && alarmFieldMapping[order.field]) {
        requestObj[mainKey]= {};
        const orderVal = alarmFieldMapping[order.field];
        let sortVal = '+';
        if (order.sort) {
            sortVal = order.sort === ('-' || 'DESC') ? '-' : '+';
        }
        requestObj[mainKey]['@order'] =`${orderVal}${sortVal}`;
    }
    return requestObj;
}


/**
 * @Description:  获取各种字典数据或公共数据
 * @Param  {string} flag:需要更新的公共数据
 * @Return {Promise}
 */
function getCommonData(flag?:string) {
    return new Promise(async (resolve:any)=>{
        try {
            if (flag && flag.length>0) {
                if (flag === 'level') {
                    alarmLevels = [];
                    const levelRes:any =await alarmLevelList();
                    if (levelRes.code === 200) {
                        levelRes.data.forEach((element:any) => {
                            const obj = <AlarmLevel>{};
                            const {
                                levelCode, levelName, levelColor, remark
                            } = element;
                            obj.levelCode=levelCode;
                            obj.levelName=levelName;
                            obj.levelColor=levelColor;
                            obj.remark=remark;
                            alarmLevels.push(obj);
                        });
                    }
                } else if ('status') {
                    alarmStatusList=[];
                    const statusRes:any =await getBasexDictData('ALERT_PROCESS_STATUS');
                    if (statusRes.code === 200) {
                        statusRes.data.forEach((element:any) => {
                            const obj = <AlarmStatus>{};
                            const { value, code } = element;
                            obj.value=value;
                            obj.code=code;
                            alarmStatusList.push(obj);
                        });
                    }
                }
            } else {
                alarmLevels = [];
                alarmStatusList=[];
                const levelRes:any =await alarmLevelList();
                if (levelRes.code === 200) {
                    levelRes.data.forEach((element:any) => {
                        const obj = <AlarmLevel>{};
                        const {
                            levelCode, levelName, levelColor, remark
                        } = element;
                        obj.levelCode=levelCode;
                        obj.levelName=levelName;
                        obj.levelColor=levelColor;
                        obj.remark=remark;
                        alarmLevels.push(obj);
                    });
                }
                const statusRes:any =await getBasexDictData('ALERT_PROCESS_STATUS');
                if (statusRes.code === 200) {
                    statusRes.data.forEach((element:any) => {
                        const obj = <AlarmStatus>{};
                        const { value, code } = element;
                        obj.value=value;
                        obj.code=code;
                        alarmStatusList.push(obj);
                    });
                }
            }
            resolve();
        } catch (error:any) {
            throw new Error(error);
        }
    });
}
/**
 * @Description: 封装返回数据
 * @Param  {AlarmConfig} option: 入参配置
 * @Param  {Object} requestData: apijson请求封装的数据
 * @Return {any}
 */
function getReturnData(option:AlarmConfig, requestData:any) {
    const { page } = option;
    // 返回数据分为是否分页
    const resArr:Array<Alarminfo> = [];
    if (page && page.open) {
        // 封装分页信息
        const pageObj:Page = page;
        pageObj.totalRows = requestData.info.total;
        // 封装数据
        requestData.data.forEach((item:any)=>{
            const alarminfoObj:any = {};
            const temp1 = alarmLevels.find((it:AlarmLevel)=>it.levelCode === item.convert_level);
            const temp2 = alarmStatusList.find((it:AlarmStatus)=>it.code === item.process_status);
            if (temp1) {
                alarminfoObj.alarmLevelInfo = temp1;
            }
            if (temp2) {
                alarminfoObj.alarmStatusInfo = temp2;
            }

            for (const k in item) {
                const key:string = _turnUpper(k);
                if (key ==='createTime' || key ==='processDate' || key === 'externalCreateTime' ) {
                    alarminfoObj[key] =new Date(item[k]).getTime();
                } else {
                    alarminfoObj[key] = item[k];
                }
            }
            resArr.push(new Alarminfo(alarminfoObj));
        });
        return { ...{}, ...pageObj, ...{
            rows: resArr
        } };
    } else {
        // 封装数据
        requestData.data.forEach((item:any)=>{
            const alarminfoObj:any = {};
            const temp1 = alarmLevels.find((it:AlarmLevel)=>it.levelCode === item.convert_level);
            const temp2 = alarmStatusList.find((it:AlarmStatus)=>it.code === item.process_status);
            if (temp1) {
                alarminfoObj.alarmLevelInfo = temp1;
            }
            if (temp2) {
                alarminfoObj.alarmStatusInfo = temp2;
            }
            for (const k in item) {
                const key:string = _turnUpper(k);
                if (key ==='createTime' || key ==='processDate' || key === 'externalCreateTime' ) {
                    alarminfoObj[key] =new Date(item[k]).getTime();
                } else {
                    alarminfoObj[key] = item[k];
                }
            }
            resArr.push(new Alarminfo(alarminfoObj));
        });
        return resArr;
    }
}

/**
 * @Description: 获取字典信息
 * @Param  {} :
 * @Return {}
 */

function getBasexDictData(code:string) {
    return sysDictTypeDropDown({ code });
}


/**
 * @Description:字符串下划线转驼峰
 */
// eslint-disable-next-line no-underscore-dangle
function _turnUpper(name:string) {
    return name.replace(/\_(\w)/g, function(_all?:any, letter?:any) {
        return letter.toUpperCase();
    });
}


/**
 * @Description: 根据孪生体分类编码和设备标识查询孪生体数据信息
 * @Param  {string} twinCode :孪生体分类编码
 * @Param  {object} otherCondition:其他条件：包括设备孪生体编码集合，楼层ID，场景ID，建筑ID
 * @Return {Promise}：
 */
function queryEquipmentData(twinCode:string, otherCondition?:any ) {
    let twinIds:Array<string> = [];
    let buildingId:string|undefined=undefined;
    let floorId:string|undefined=undefined;
    let campus:string|undefined=undefined;
    let sceneId:string|undefined=undefined;
    if (otherCondition) {
        twinIds = otherCondition.twinIds;
        buildingId = otherCondition.buildingId;
        floorId = otherCondition.floorId;
        campus = otherCondition.campus;
        sceneId = otherCondition.sceneId;
    }
    const requestObj:any={
        '[]': {
            [twinCode]: {}
        },
        // '@explain': true,
        'total@': '/[]/total',
        'info@': '/[]/info'
    };
    if (twinIds && twinIds.length) {
        requestObj['[]'][twinCode]['UniqueCode{}']=twinIds;
    }
    if (buildingId) {
        requestObj['[]'][twinCode]['cb_building_id']=buildingId;
    }
    if (floorId) {
        requestObj['[]'][twinCode]['cb_floor_id']=buildingId;
    }
    if (sceneId) {
        requestObj['[]'][twinCode]['scene_id']=sceneId;
    }
    if (campus) {
        requestObj['[]'][twinCode]['parent_id']=0;
    }
    return new Promise(async (resolve:any, reject:any)=>{
        const res:any = await getJsonData(requestObj);
        if (res.ok) {
            if (res['[]']) {
                resolve(res['[]']);
            } else {
                resolve([]);
            }
        } else {
            reject(res);
        }
    });
}


/**
 * @Description: 扁平化处理第一次apijson请求的数据
 * @Param  {Array} arr: 第一次apijson请求的数据
 * @Param  {string} mainKey:主表key
 * @Return {Array}
 */
function handleApijsonData(arr:Array<any>, mainKey:string) {
    const res:Array<any> = [];
    arr.forEach((ele:any)=>{
        if (Object.keys(ele[mainKey]).length !== 0) {
            res.push(ele[mainKey]);
        }
    });
    return res;
}
