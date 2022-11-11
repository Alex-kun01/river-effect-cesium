/*
 * @Description:
 * @Version: 1.0
 * @Autor: wl
 * @Date: 2022-03-01
 * @LastEditors: yls
 * @LastEditTime: 2022-04-21 18:04:58
 */

/* eslint-disable */
import { message, notification } from 'ant-design-vue'; // es/notification
import { getViewList, saveView } from '@/api/defaultApi/index';
class CameraView {
    app: any;
    private _sceneId: any;
    viewData:any;
    constructor(app:any, sceneId:any, eventParam:any) {
        // 注入app
        this.app = app;
        // 站点id
        /* eslint no-underscore-dangle: 0 */
        this._sceneId = sceneId;

        /** 定义接口获取的视角存储对象(按照键值对的形式存储)
         *  this.viewData = {uuid: [position, target, up]};
         */
        this.viewData = {};

        // 当前层级，右键双击返回默认视角
        this.backCampusView();

        // 各层级切换
        this.levelChange();

        // 按Alt + s键保存当前视角
        this.saveEvent(eventParam);

        // 初始化视角组件
        this.init();
    }

    // 初始化视角
    init() {
        // 获取接口内的全部视角
        this.getViewData().then(() => {
            // 获取当前层级
            const { current } = this.app.level;
            const levelId = current.uuid == '0' ? '1' : current.uuid;
            // 当前初始化的层级视角飞行
            this.cameraFly(levelId,()=>{});
        });
    }
    // 获取当前视角
    obtainView() {
        const {
            position,
            target,
            up,
        } = this.app.camera;
        return {
            target,
            position,
            up,
        };
    }

    /**
     * 快捷键/点击事件保存当前视角
     * @param {*} eventParam
     * 1.DOM元素
     * 2.键码
     * eventParam = {
     *      type: 'DOM', // DOM, keyCode (视角保存方式的类型)
     *      name: 'saveView' // 名称类型: obj, number (保存方式类型的名称或键码)
     * }
     */
    saveEvent(eventParam:any) {
        const param = eventParam;
        if (param && (param.type || param.name) && (param.type !== '' && param.name !== '')) {
            if (param.type === 'DOM') {
                // TODO 传入的是元素节点，做click事件
                param.name.onclick = () => {
                    this.saveViewCommon();
                };
            } else {
                // TODO 传入的是键码，做keydown事件(暂定alt + 任意控制字符)
                document.onkeydown = (e) => {
                    if (e.keyCode === param.name && e.altKey) {
                        this.saveViewCommon();
                    }
                };
            }
        }

        // TODO 没有传入参数，使用默认的Alt + s快捷键保存视角
        document.onkeydown = (e) => {
            if (e.keyCode === 83 && e.altKey) {
                this.saveViewCommon();
            }
        };
    }

    // 保存视角公共方法
    saveViewCommon() {
        // 判断2D模式下禁止自定义视角保存操作
        try {
            // eslint-disable-next-line no-throw-literal
            if (this.app.camera.viewMode === 'topview') throw '2D模式下禁止自定义视角保存操作';
            if (window.uino.canSaveDeviceView && window.uino.currentDevice.pointId) {
                this.saveView(window.uino.currentDevice.pointId);
            } else {
                // 存储当前视角
                this.saveView(null);
            }
        } catch (error:any) {
            message.error(error);
        }
    }
    // 处理当前childUuid
    childUuidEvent(objId:any, data:any, myUuid:any) {
        const { type } = uino.app.level.current;
        if (type === 'Campus') {
            myUuid = data[0].uuid;
        } else {
            data.forEach((e: { campusBuilderId: any; uuid: any; children: string | any[]; }) => {
                e.campusBuilderId === objId && (myUuid = e.uuid);
                if (e.children && e.children.length > 0) {
                    myUuid = this.childUuidEvent(objId, e.children, myUuid)
                }
            })

        }
        return myUuid
    }
    // 接口——存储当前视角
    saveView(pointId:any) {
        // 获取当前的对象的uuid
        let objId = '';
        if (pointId) {
            // 物体的id
            objId = pointId;
        } else {
            // 层级的id
            if (window.uino.partitionId) {
                objId = window.uino.partitionId
            } else {
                const { current } = this.app.level;
                objId = current.uuid;
            }
        }

        //  获取当前摄影机的视角
        const currentView = this.obtainView();
        // 层级判断，不同层级下存储不同的摄影机位置信息
        /* eslint no-underscore-dangle: 0 */
        const param = {
            childUuid: this.childUuidEvent(objId, window.uino.sceneInfo.children,null),
            mainUuid: window.uino.sceneId,
            configCamInfo: JSON.stringify(currentView),
        };
        saveView(param).then((res:any) => {
            try {
                // eslint-disable-next-line no-throw-literal
                if (res.code !== 200) throw '保存视角接口报错';

                // 获取全部视角
                this.getViewData();
                notification.success({
                    message: '成功',
                    description: '自定义视角保存成功',
                })
            } catch (error:any) {
                message.error(error);
            }
        });
    }

    // 接口——获取数据库存储的全部视角
    getViewData() {
        // 获取全部视角
        /* eslint no-underscore-dangle: 0 */
        return new Promise<void>((resolve, reject) => {
            const params = { sceneId: window.uino.sceneId, dataId: '1' };
            const { type } = this.app.level.current;
            if (type === 'Campus' || type === 'Building') {
                params.dataId = '';
            } else {
                params.dataId = this.childUuidEvent(window.uino.app.level.current.parent.uuid, window.uino.sceneInfo.children,null);
            }
            getViewList(params).then((res:any) => {
                if (res.code !== 200) {
                    reject('保存视角接口报错')
                } else {
                    this.viewData = res.data.reduce((pre:any, cur:any) => {
                        pre[cur.campusBuilderId] = cur
                        return pre
                    }, {})
                    resolve()
                }
            });
        })

    }

    // 园区，建筑，楼层进入调用保存的视角飞行函数
    levelChange() {
        this.app.pauseEvent(THING.EventType.EnterLevel, '.Building || .Floor', THING.EventTag.LevelFly);
        this.app.on(THING.EventType.EnterLevel, '.Campus || .Building || .Floor || .Room', (event:any) => {

            const ev = event;
            const levelId = ev.current.uuid == '0' ? '1' : ev.current.uuid;
            // window.vm.bus.$emit('showOrHiddenPanel', false);
            // vm.$store.dispatch('deviceInfo/setDevice', {});
            if (!window.uino.iSPlayAnim) {
                this.getViewData().then(() => {
                    // 层级切换摄影机飞行视角
                    this.cameraFly(levelId,()=>{});
                })
            }


        }, 'customCameraView');
    }

    /**
     * @description 层级切换摄影机飞行
     * @param levelId(层级的uuid)
     * @param callback(回调函数)
     */
    cameraFly(levelId:string, callback:any) {
        // 如果视角被保存过，走自定义视角
        if (this.viewData[levelId] && this.viewData[levelId].configCamInfo) {
            this.customViewFlyTo(levelId, callback);
        } else {
            // 未保存过视角，走thingjs内置方法计算的最佳视角
            const obj = this.app.query(`##${levelId}`)[0];
            this.app.camera.flyTo({
                target: obj,
                time: 1500,
                complete() {
                    // TODO 默认视角飞行回调
                    if (callback) {
                        callback();
                    }
                },
            });
        }
    }

    // 物体视角保存方法
    saveObjView(pointId:any) {
        this.saveView(pointId);
    }

    /**
     * @description 物体视角飞行方法
     * @param param = {
     *    objectId: '91A53316-16BF-43CC-87BD-EAF30F0E3FEE',
     *    object: obj,
     *    offset: [0, 2, 0],
     *    time: 2000,
     * }
     */
    cameraFlyToObj(param:any, callback:any) {
        if (!param.object) {
            return;
        }

        // 判断该物体是否被保存过视角，如果被保存过，走自定义的视角
        if (this.viewData[param.object.id]) {
            this.customViewFlyTo(param.object.id, callback);
        } else if (this.viewData[param.objectId]) {
            this.customViewFlyTo(param.objectId, callback);
        } else {
            // 未保存过视角，走thingJs内置方法计算的最佳视角
            this.app.camera.flyTo({
                // object: param.object,
                target: window.uino.app.query(`#${param.object.id}`)[0].position,
                offset: param.offset ? param.offset : [3, 3, 3],
                // radiusFactor: 2,
                time: param.time ? param.time : 1500,
                complete() {
                    // 执行回调
                    if (callback) {
                        callback();
                    }
                },
            });
        }
    }

    // 涉及到切换层级的视角拉近
    // isChange 额外的切换层级判断
    changeLevelFly(params:any, callback:any) {
        const thing = params.object;
        const parent = thing.parent;
        const currentLevel = window.uino.app.level.current.uuid;
        const targetLevel = parent.uuid;
        if (currentLevel !== targetLevel) {
            const time = currentLevel === parent.parent.uuid ? 500 : 3000;
            uino.app.level.change(parent, {
                complete: () => {
                    setTimeout(() => {
                        window.uino.customCamera.cameraFlyToObj({
                            ...params,
                        }, () => {
                            callback && callback();
                        });
                    }, time)
                }
            });
        } else {
            window.uino.customCamera.cameraFlyToObj({
                ...params,
            }, () => {
                callback && callback();
            });
        }
    }

    // 覆盖thingJs内置计算视角的方法，自定义视角飞行
    customViewFlyTo(levelId:any, callback:any) {
        // 保存的视角
        if (this.viewData[levelId].configCamInfo) {
            const {
                position,
                target,
                up,
            } = JSON.parse(this.viewData[levelId].configCamInfo);
            this.app.camera.flyTo({
                position,
                target,
                up,
                time: 1500,
                complete: () => {
                    // TODO 飞行回调--外界注入的回调
                    if (callback) {
                        callback();
                    }
                },
            });
        }

    }

    // 右键双击返回园区默认视角
    backCampusView() {
        // 在campus层级右键双击，视角回归入场视角
        this.app.on(THING.EventType.DBLClick, '.Campus', (e: { button: number; }) => {
            if (e.button === 2) {
                if (this.app.ctrl || this.app.camera.viewMode === 'topview') {
                    return;
                }
                window.uino.partitionId = '';
                if (this.app.level.current.type === 'Campus' && window.uino.currentSelect === 'ComprehensiveOverview') {
                    this.app.level.change(this.app.level.current, {
                        complete() { },
                    });
                }
                const things = window.uino.app.query('.Thing').objects;
                things.forEach((item: { bundleName: string; visible: boolean; }) => {
                    if (item.bundleName && item.bundleName === '万能方盒子') {
                        item.visible = false;
                    }
                });
            }
        }, 'campusViewDBBack', 51);
    }

    // 暂停自定义视角进入层级事件
    pauseCameraVw() {
        this.app.pauseEvent(THING.EventType.EnterLevel, '.Campus || .Building || .Floor', 'customCameraView');
    }

    // 恢复自定义视角进入层级事件
    resumeCameraVw() {
        this.app.resumeEvent(THING.EventType.EnterLevel, '.Campus || .Building || .Floor', 'customCameraView');
    }

    set sceneId(data: any) {
        /* eslint no-underscore-dangle: 0 */
        this._sceneId = data;
        this.getViewData();
    }
}

export default CameraView;
