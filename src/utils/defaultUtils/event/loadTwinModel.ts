/*
 * @Description: 加载园区点位
 * @Version: 1.0
 * @Autor: hasaiki
 * @Date: 2022-03-08 15:50:26
 * @LastEditors: hasaiki
 * @LastEditTime: 2022-04-26 14:34:07
 */
import { queryTwinDataBySceneId } from '@/api/defaultApi/index'; // 查询点位列表接口
import { useMainStore } from '@/store';
import ModelEvent from '@/utils/defaultUtils/event/modelEvent';
import _ from 'lodash';
interface twinbodyParam {
  sceneId: number, // 必传，场景id。
  dataSources?: string, // 数据来源，非必传。包括以下类型：TWIN, ASSET, ASSET_IMPORT, MMD, CAD, GIS
  parentId?:string, // 场景层级中的物体id，非必传。
  twinClassIds?:Array<any>, // 孪生对象id列表，非必传
  onlyMine?:number, // 只查询我的点位，非必传，默认false
  ignoreKeys?:Array<string> // 忽略的结果列，非必传
}
interface ElMarkerParam { // 自定义element气泡
  el?: HTMLDivElement, // dom 当el存在的时候会自动忽略url
  size?: number, // marker大小 默认 2
  localPosition?: number[], // 相对父级位置 默认[0,0,0]
  keepSize?: boolean, // 是否keepSize 默认 false
  pivot?: number[], // 锚点位置 默认[0.5,0.5]
  url?: string, // 图片地址
  alwaysOnTop: boolean // 是否在最上级 默认true
}
interface BoundaryParam { // 自定义boundary类型的孪生体线属性
  image?:string, // 围栏底图 默认 '/static/image/common/boundary.png'
  height?:number, // 围栏高度 默认3
  direction?:string, // 滚动方向 默认'x'
  scroll?:boolean, // 是否滚动 默认 true
  speed?:number // 滚动速度 // 默认2
}
interface RouterLineParam { // 自定义routeLine类型的孪生体线属性
  image?:string, // 路线底图 默认 '/static/image/common/routeLine.png'
  width?:number, // 宽度 默认3
  arrowCap?:boolean, // 去掉箭头 默认false
  scroll?:boolean, // 是否滚动 默认 true
  emissive?:string | null // 滚动速度 // 默认null
}
export default class loadTwinModel {
    originData: Array<any> = []
    mainStore: any // store
    openEarch: boolean = false // 是否加载地图
    loadModelFlag: boolean = false // 是否加载模型
    defaultTwinMap: Map<string, any> = new Map() // 默认孪生体对象Map-ROOM FLOOR BUILDING
    userTwinLevelMap: Map<number|string, any> = new Map() // 用户摆点孪生体对象Map  key:层级 value[]:层级点位
    userTwinArray: Array<any> = [] // 所有用户摆点孪生体对象 array
    constructor(param:twinbodyParam, cb?:Function) {
        this.mainStore = useMainStore();
        this.queryTwinData(param, cb);
    }
    /**
     * @description 查询场景点位列表
     * @author hasaiki
     * @date 2022/03/08
     * @param {twinbodyParam} param 查询参数
     * @param {Function} [cb] 点位处理完毕回调
     * @memberof loadModel
     */
    async queryTwinData(param:twinbodyParam, cb?:Function) {
        // 默认请求dataSources = 'TWIN'
        if (_.isEmpty(param.dataSources)) param = Object.assign(param, { dataSources: 'TWIN' });
        await queryTwinDataBySceneId(param).then((res:any)=>{
            if (res.code === 200) {
                this.originData = res.data;
                if (_.isEmpty(this.originData)) return;
                this.disposeTwinData(this.originData);
                if (cb) {
                    cb();
                }
            }
        });
    }
    /**
     * @description 设置点位列表数据并处理
     * @author hasaiki
     * @date 2022/03/08
     * @param {Array<any>} data 点位列表数据
     * @memberof loadModel
     */
    setTwinData(data:Array<any>) {
        if (_.isEmpty(data)) return;
        this.originData = data;
        this.disposeTwinData(data);
    }
    /**
     * @description 处理点位列表数据
     * @author hasaiki
     * @date 2022/03/08
     * @param {*} data
     * @memberof loadModel
     */
    disposeTwinData(data:any) {
        data.forEach((child:any) => {
            // 处理默认孪生对象 ROOM FLOOR BUILDING
            const room = this.defaultTwinMap.get('ROOM');
            const floor = this.defaultTwinMap.get('FLOOR');
            const building = this.defaultTwinMap.get('BUILDING');
            switch (child.twinClassCode) {
                case 'ROOM':
                    if (room) {
                        room.originData.push(child);
                    } else {
                        this.defaultTwinMap.set('ROOM', {
                            originData: [child]
                        });
                    }
                    break;
                case 'FLOOR':
                    if (floor) {
                        floor.originData.push(child);
                    } else {
                        this.defaultTwinMap.set('FLOOR', {
                            originData: [child]
                        });
                    }
                    break;
                case 'BUILDING':
                    if (building) {
                        building.originData.push(child);
                    } else {
                        this.defaultTwinMap.set('BUILDING', {
                            originData: [child]
                        });
                    }
                    break;
                default:
                    break;
            }
            // 处理用户孪生对象
            // PARK / FLOOR
            if (child.cb_current_level) {
                // 存储数据-array
                this.userTwinArray.push(child);
                // 存储数据Map：key:层级id value[]:层级数据
                const levelData = this.userTwinLevelMap.get(child.parentId);
                if (levelData) {
                    levelData.push(child);
                } else {
                    this.userTwinLevelMap.set(child.parentId, [child]);
                }
            }
        });
    }
    /**
    * @description 加载当前层级所有孪生体对象
    * @author hasaiki
    * @date 2022/03/09
    * @param {ElMarkerParamcb} [el] 气泡自定义
    * @param {Function} [cb] 加载完毕回调
    * @memberof loadTwinModel
    */
    loadCurrentLevelTwin(el?:ElMarkerParam, cb?:Function) {
        if (!window.uino || !window.uino.app) return;
        const current = window.uino.app.level.current.uuid;
        const twinData = this.userTwinLevelMap.get(current);
        if (twinData) {
            this.loadModelFlag = true;
            this.loadModel(
                twinData, 0, el, ()=>{
                    if (cb) {
                        cb();
                    }
                }
            );
        }
    }
    /**
     * @description 隐藏当前层级孪生体对象
     * @author hasaiki
     * @date 2022/03/09
     * @memberof loadTwinModel
     */
    hideCurrentLevelTwin() {
        if (!window.uino || !window.uino.app) return;
        const current = window.uino.app.level.current.uuid;
        const twinData = this.userTwinLevelMap.get(current);
        if (twinData) {
            this.loadModelFlag = false;
            twinData.forEach((twin:any) => {
                const model = window.uino.app.query(`##${twin.uuid}`)[0];
                if (model) {
                    model.visible = false;
                }
            });
        }
    }
    /**
     * @description 根据点位uuid渲染模型
     * @author hasaiki
     * @date 2022/03/09
     * @param {(Array<string> | string)} uuid
     * @param {ElMarkerParam} [el] 自定义气泡
     * @param {Function} [cb] 完成回调
     * @memberof loadTwinModel
     */
    loadModelByUuid(uuid: Array<string> | string, el?:ElMarkerParam, cb?:Function) {
        if (_.isEmpty(uuid)) return;
        const current = window.uino.app.level.current.uuid;
        const twinData = this.userTwinLevelMap.get(current);
        if (twinData) {
            if (_.isArray(uuid)) {
                const twinInfo = twinData.filter((item:any)=>uuid.includes(item.uuid));
                if (twinInfo.length > 0) {
                    this.loadModelFlag = true;
                    this.loadModel(
                        twinInfo, 0, el, ()=>{
                            if (cb) {
                                cb();
                            }
                        }
                    );
                }
            } else {
                const twinInfo = twinData.filter((item:any)=>uuid === item.uuid);
                if (twinInfo.length > 0) {
                    this.loadModelFlag = true;
                    this.loadModel(
                        twinInfo, 0, el, ()=>{
                            if (cb) {
                                cb();
                            }
                        }
                    );
                }
            }
        }
    }
    /**
     * @description 根据twinClassId加载点位
     * @author hasaiki
     * @date 2022/03/10
     * @param {(Array<string> | string)} classId
     * @param {ElMarkerParam} [el] 自定义气泡
     * @param {Function} [cb] 回调
     * @memberof loadTwinModel
     */
    loadModelByTwinClassId(classId: Array<string> | string, el?:ElMarkerParam, cb?:Function) {
        if (_.isEmpty(classId)) return;
        const current = window.uino.app.level.current.uuid;
        const twinData = this.userTwinLevelMap.get(current);
        if (twinData) {
            if (_.isArray(classId)) {
                const twinInfo = twinData.filter((item:any)=>classId.includes(item.twinClassId));
                if (twinInfo.length > 0) {
                    this.loadModelFlag = true;
                    this.loadModel(
                        twinInfo, 0, el, ()=>{
                            if (cb) {
                                cb();
                            }
                        }
                    );
                }
            } else {
                const twinInfo = twinData.filter((item:any)=>classId === item.twinClassId);
                if (twinInfo.length > 0) {
                    this.loadModelFlag = true;
                    this.loadModel(
                        twinInfo, 0, el, ()=>{
                            if (cb) {
                                cb();
                            }
                        }
                    );
                }
            }
        }
    }
    /**
     * @description 加载模型函数
     * @author hasaiki
     * @date 2022/03/09
     * @param {*} data 点位信息
     * @param {number} index
     * @param {ElMarkerParam} [el] 自定义气泡
     * @param {Function} [cb] 加载完毕回调
     * @memberof loadTwinModel
     */
    loadModel(
        data:any, index:number, el?:ElMarkerParam, cb?:Function
    ) {
        if (!window.uino || !window.uino.app) return;
        if (!this.loadModelFlag) return;
        const modelData = data[index];
        const model = window.uino.app.query(`##${modelData.uuid}`)[0];
        if (model) {
            // 存在-显示
            model.visible = true;
            if (index < data.length - 1) {
                const i = index + 1;
                this.loadModel(
                    data, i, el, cb
                );
            } else if (cb) {
                cb();
            }
        } else {
            // 不存在-加载 SURFACE-面 POINT-点 LINE-线
            switch (modelData.dataType) {
                case 'POINT':
                    this.loadPoint(modelData, (flag:boolean)=>{
                        if (flag) {
                            this.createMarker(modelData, el, ()=>{
                                this.loadNext(
                                    data, index, el, cb
                                );
                            });
                        } else {
                            this.loadNext(
                                data, index, el, cb
                            );
                        }
                    });
                    break;
                case 'LINE':
                    this.loadLine(modelData, (flag:boolean)=>{
                        if (flag) {
                            this.createMarker(modelData, el, ()=>{
                                this.loadNext(
                                    data, index, el, cb
                                );
                            });
                        } else {
                            this.loadNext(
                                data, index, el, cb
                            );
                        }
                    });
                    break;
                case 'SURFACE':
                    this.loadPolygon(modelData, (flag:boolean)=>{
                        if (flag) {
                            this.createMarker(modelData, el, ()=>{
                                this.loadNext(
                                    data, index, el, cb
                                );
                            });
                        } else {
                            this.loadNext(
                                data, index, el, cb
                            );
                        }
                    });
                    break;

                default:
                    break;
            }
        }
    }
    /**
     * @description 递归加载下一个
     * @author hasaiki
     * @date 2022/03/09
     * @param {*} data 点位数据
     * @param {number} index 当前index
     * @param {ElMarkerParam} [el] 自定义气泡
     * @param {Function} [cb] 完成回调
     * @memberof loadTwinModel
     */
    loadNext(
        data:any, index:number, el?:ElMarkerParam, cb?:Function
    ) {
        if (index < data.length - 1) {
            const i = index + 1;
            this.loadModel(
                data, i, el, cb
            );
        } else if (cb) {
            cb();
        }
    }
    /**
       * @description 批量改变园区坐标为世界坐标（当园区加载在地球上时使用）
       * @author hasaiki
       * @date 2022/04/14
       * @param {*} parent 父模型
       * @param {any[]} arr 子坐标数组
       * @return {*} 转换后坐标
       * @memberof loadTwinModel
       */
    changeInToWorldBatch (parent:any, arr:any[]) {
        const newArr = [];
        for (let i = 0; i < arr.length; i += 1) {
            newArr.push(this.changeInToWorld(parent, arr[i]));
        }
        return newArr;
    }
    /**
       * @description 改变园区坐标为世界坐标（当园区加载在地球上时使用）
       * @author hasaiki
       * @date 2022/04/14
       * @param {*} parent 父模型
       * @param {any[]} arr 子坐标
       * @return {*} 转换后坐标
       * @memberof loadTwinModel
       */
    changeInToWorld(parent:any, arr:any[]) {
        return parent.selfToWorld([arr[0], arr[1], arr[2]]);
    }
    /**
     * @description 加载point类型点位
     * @author hasaiki
     * @date 2022/03/09
     * @param {*} data 点位信息
     * @param {Function} [cb] 加载完毕回调
     * @memberof loadTwinModel
     */
    loadPoint(data:any, cb?:Function) {
        const cbData = JSON.parse(data.cbData);
        const parent = window.uino.app.query(`##${data.parentId}`)[0];
        const position = this.openEarch ? this.changeInToWorld(parent, cbData.pos):cbData.pos;
        if (cbData.bundle) {
            window.uino.app.create({
                id: cbData.id,
                uuid: data.uuid,
                name: cbData.name,
                type: 'Thing',
                url: `${`${window.config.previewModelUrl}model/${cbData.bundle}`}/0/gltf/`,
                angles: cbData.rot,
                scale: cbData.scale,
                size: cbData.size,
                userData: data,
                position,
                parent,
                complete(ev:any) {
                    new ModelEvent().hover(ev.object);
                    if (cb) {
                        cb(true);
                    }
                },
                error() {
                    if (cb) {
                        cb(false);
                    }
                }
            });
        }
    }
    /**
     * @description 创建线
     * @author hasaiki
     * @date 2022/03/09
     * @param {*} data 点位信息
     * @param {Function} [cb] 完成回调
     * @memberof loadTwinModel
     */
    loadLine(data:any, cb?:Function) {
        const cbData = JSON.parse(data.cbData);
        const parent = window.uino.app.query(`##${data.parentId}`)[0];
        const transPoints = this.openEarch ? this.changeInToWorldBatch(parent, cbData.vertices):cbData.vertices;
        window.uino.app.create({
            id: cbData.id,
            uuid: data.uuid,
            name: cbData.name,
            type: 'Line',
            angles: cbData.rot,
            userData: data,
            parent,
            width: cbData.width,
            points: transPoints,
            color: cbData.color,
            complete(ev:any) {
                new ModelEvent().hover(ev.object);
                if (cb) {
                    cb(true);
                }
            },
            error() {
                if (cb) {
                    cb(false);
                }
            }
        });
    }
    /**
     * @description 加载围栏
     * @author hasaiki
     * @date 2022/04/06
     * @param {*} data
     * @param {ElMarkerParam} el 自定义气泡
     * @param {BoundaryParam} param 自定义boundary样式
     * @param {Function} [cb]
     * @memberof loadTwinModel
     */
    loadBoundary(
        data:any, el?:ElMarkerParam, param?:BoundaryParam, cb?:Function
    ) {
        const that = this;
        this.loadModelFlag = true;
        const cbData = JSON.parse(data.cbData);
        const parent = window.uino.app.query(`##${data.parentId}`)[0];
        const transPoints = this.openEarch ? this.changeInToWorldBatch(parent, cbData.vertices):cbData.vertices;
        let image = '/static/image/common/boundary.png'; // 围栏底图
        let height = 3; // 围栏高度
        let direction = 'x'; // 滚动方向
        let scroll = true; // 是否滚动
        let speed = 2; // 滚动速度
        if (param) {
            image = param.image || '/static/image/common/boundary.png'; // 围栏底图
            height = param.height || 3; // 高度
            direction = param.direction || 'x';
            scroll = param.scroll || true;
            speed = param.speed || 2;
        }
        const boundary = window.uino.app.create({
            id: cbData.id,
            uuid: data.uuid,
            name: cbData.name,
            type: 'Boundary',
            userData: data,
            parent,
            points: transPoints,
            scroll,
            height,
            image,
            imageRepeat: [2, 1],
            complete(ev:any) {
                // 开启动画
                setInterval(()=>{
                    if (direction === 'x') {
                        boundary.setScroll(speed, 0);
                    } else {
                        boundary.setScroll(0, speed);
                    }
                }, 1000);
                new ModelEvent().hover(ev.object);
                that.createMarker(data, el, cb);
            }
        });
    }
    /**
     * @description 加载routeLine
     * @author hasaiki
     * @date 2022/04/06
     * @param {*} data
     * @param {ElMarkerParam} el 自定义气泡
     * @param {RouterLineParam} param 自定义routeLine样式
     * @param {Function} [cb]
     * @memberof loadTwinModel
     */
    loadRouteLine(
        data:any, el?:ElMarkerParam, param?:RouterLineParam, cb?:Function
    ) {
        const that = this;
        this.loadModelFlag = true;
        const cbData = JSON.parse(data.cbData);
        const parent = window.uino.app.query(`##${data.parentId}`)[0];
        const transPoints = this.openEarch ? this.changeInToWorldBatch(parent, cbData.vertices):cbData.vertices;
        let image = '/static/image/common/routeLine.png';
        let width = 2; // 宽度
        let arrowCap = false; // 去掉箭头
        let scroll = true; // 是否开启动画
        let emissive = null; // 发光效果
        if (param) {
            image = param.image || '/static/image/common/routeLine.png';
            width = param.width || 2;
            arrowCap = param.arrowCap || false;
            scroll = param.scroll || true;
            emissive = param.emissive || null;
        }
        window.uino.app.create({
            id: cbData.id,
            uuid: data.uuid,
            name: cbData.name,
            type: 'RouteLine',
            userData: data,
            parent,
            points: transPoints,
            angles: [0, 0, 0],
            scrollUV: scroll, // 动画
            width,
            arrowCap, // 去掉箭头
            style: {
                image, // 线路中的纹理资源
                opacity: 1,
                emissive // 发光效果
            },
            complete(ev:any) {
                new ModelEvent().hover(ev.object);
                that.createMarker(data, el, cb);
            },
            error() {
                if (cb) {
                    cb(false);
                }
            }
        });
    }
    /**
     * @description 创建面
     * @author hasaiki
     * @date 2022/03/09
     * @param {*} data 点位数据
     * @param {Function} [cb] 完成回调
     * @memberof loadTwinModel
     */
    loadPolygon(data:any, cb?:Function) {
        const cbData = JSON.parse(data.cbData);
        const parent = window.uino.app.query(`##${data.parentId}`)[0];
        const transPoints = this.openEarch ? this.changeInToWorldBatch(parent, cbData.vertices):cbData.vertices;
        window.uino.app.create({
            type: 'PolygonRegion',
            id: cbData.id,
            uuid: data.uuid,
            name: cbData.name,
            angles: cbData.rot,
            userData: data,
            parent,
            points: transPoints,
            style: {
                regionColor: cbData.regionColor,
                lineColor: cbData.lineColor,
                regionOpacity: cbData.regionOpacity
            },
            complete(ev:any) {
                new ModelEvent().hover(ev.object);
                if (cb) {
                    cb(true);
                }
            },
            error() {
                if (cb) {
                    cb(false);
                }
            }
        });
    }
    /**
     * @description 创建气泡-常规-从baseX获取
     * @author hasaiki
     * @date 2022/03/09
     * @param {*} data
     * @param {ElMarkerParam} [el] 自定义气泡
     * @param {Function} [cb] 创建完成回调
     * @memberof loadTwinModel
     */
    createMarker(data:any, el?:ElMarkerParam, cb?:Function) {
        if (!this.loadModelFlag) return;
        if (el) {
            this.createElMarker(data, el, cb);
        } else {
            const bubbleInfo = data.bubbleInfoVo;
            const parent = window.uino.app.query(`##${data.uuid}`)[0];
            const marker = window.uino.app.query(`##Marker${data.uuid}`)[0];
            if (marker) {
                marker.visible = true;
            } else {
                window.uino.app.create({
                    type: 'Marker',
                    uuid: `Marker${data.uuid}`,
                    id: `Marker${bubbleInfo.id}`,
                    pivot: [0.5, 1],
                    name: bubbleInfo.name,
                    parent,
                    userData: data,
                    inheritStyle: false,
                    inheritScale: false,
                    scale: [1, 1, 1],
                    localPosition: [0, 0, 0],
                    url: `${window.config.previewUrl}${bubbleInfo.imgUrl}`,
                    size: parseInt(window.configXxv.QI_PAO_SIZE, 10) || 12,
                    style: {
                        alwaysOnTop: true
                    },
                    complete() {
                        if (cb) cb();
                    }
                }).on('click', (ev:any) => {
                    // 保存点击的气泡信息到store
                    this.mainStore.setClickMarkerInfo(ev.object.userData || '');
                });
            }
        }
    }
    /**
     * @description 创建气泡-自定义
     * @author hasaiki
     * @date 2022/04/14
     * @param {*} data 孪生体数据
     * @param {*} el 自定义气泡
     * @param {Function} [cb]
     * @memberof loadTwinModel
     */
    createElMarker(data:any, el:ElMarkerParam, cb?:Function) {
        if (!this.loadModelFlag) return;
        const bubbleInfo = data.bubbleInfoVo;
        const customParam:any = {
            style: {}
        };
        if (el.el) {
            customParam.element = el.el;
        } else if (el.url) {
            customParam.url = el.url;
        } else {
            customParam.url = `${window.config.previewUrl}${bubbleInfo.imgUrl}`;
        }
        customParam.size = el.size || 12;
        customParam.localPosition = el.localPosition || [0, 0, 0];
        customParam.keepSize = el.keepSize || false;
        customParam.pivot = el.pivot || [0.5, 0.5];
        customParam.size = el.size || 12;
        customParam['style'].alwaysOnTop = el.alwaysOnTop || true;

        const parent = window.uino.app.query(`##${data.uuid}`)[0];
        const marker = window.uino.app.query(`##Marker${data.uuid}`)[0];
        if (marker) {
            marker.visible = true;
        } else {
            window.uino.app.create({
                type: 'Marker',
                uuid: `Marker${data.uuid}`,
                id: `Marker${bubbleInfo.id}`,
                name: bubbleInfo.name,
                parent,
                userData: data,
                inheritStyle: false,
                inheritScale: false,
                scale: [1, 1, 1],
                ...customParam,
                complete() {
                    if (cb) cb();
                }
            }).on('click', (ev:any) => {
                // 保存点击的气泡信息到store
                this.mainStore.setClickMarkerInfo(ev.object.userData || '');
            });
        }
    }
}
