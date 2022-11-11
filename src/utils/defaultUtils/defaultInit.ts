/**
 * @description 默认初始化文件入口
 * @author yrj 2022-02-28
 */
// 自定义Deploy设备类
import Deploy from './deploy';
// // 设备类添加thing扩展方法
// import deployExtendThing from '@/views/commonJs/deployExtendThing.js';
// 自定义视角
import CustomCamera from '@/utils/defaultUtils/event/cameraView';
// 层级切换
import Levelchange from '@/utils/defaultUtils/event/levelChange';
// 楼层触摸动效
import FloorAnimate from '@/utils/defaultUtils/event/floorAnimate';
// 设备触摸动效
import DeviceAnimate from '@/utils/defaultUtils/event/deviceAnimate';
// 鼠标pick事件
import PickEvent from '@/utils/defaultUtils/event/pickEvent';
// // 加载设备
// import LoadDevice from '@/views/commonJs/event/loadDevice';


const defaultInit = {
    // 是否添加thing扩展方法
    isExtend: false,
    init(app: any, campus: any) {
        if (!app || !campus) return;
        this.defaultEvent(app, campus);
        this.defaultMethods();
        new PickEvent();
    },

    // 初始化默认事件
    defaultEvent(appObj: any, campus: any) {
        const app = appObj;
        // 基础常规属性设置
        app.root.static = true;
        app.camera.far = 999999;
        app.camera.fov = 45;
        app.camera.distanceLimited = [5, 159999];
        app.camera.xAngleLimitRange = [0, 90];
        app.camera.dampingFactor = 0.15; // 设置摄像机惯性插值因子，数值越小插值效果越明显
        app.level.change(campus);
        uino.$campus = app.query('.Campus')[0];
        // 禁止双击进入
        app.pauseEvent(THING.EventType.EnterLevel, '.Thing || .Marker || .Facade');
        // 禁止房间勾边
        // app.query('.Room').style.outlineColor = null;
        // 进入建筑保留天空盒
        app.pauseEvent(THING.EventType.EnterLevel, '.Building || .Floor', THING.EventTag.LevelSetBackground);
        // 禁止鼠标单击退出层级
        app.pauseEvent(THING.EventType.Click, null, THING.EventTag.LevelBackMethod);
        // 禁止双击事件
        app.pauseEvent(THING.EventType.DBLClick, '*', THING.EventTag.LevelEnterMethod);
        // 关闭，进到室内自动切换天空盒
        app.level.options.autoChangeBackground = false;
        setTimeout(() => {
            uino.customCamera = new CustomCamera(app, uino.sceneId, null);
        }, 2000);
    },
    // 初始化默认方法

    defaultMethods() {
        // 注册Deploy设备事件
        this.registerDeploy();
        // // 拓展Thing类
        // this.extendThingMethod();
        // 初始化楼层触摸动效
        new FloorAnimate();
        new DeviceAnimate();
        // uino.loadDevice = new LoadDevice(app);
        // uino.loadDevice.begin('', () => {
        // });

        // 初始化LevelChange事件
        uino.level = new Levelchange();
        setTimeout(() => {
            // 全局视角调用
            // uino.customCamera = new CustomCamera(app, uino.sceneId);
        }, 1000);
    },
    /**
     * @description 注册Deploy
     * @author yrj 2022-02-28
     */
    registerDeploy() {
        THING.factory.registerClass('Deploy', Deploy);
        uino.thing = {
            select: null
        };
    }
    // /**
    //  * @description 扩展thing的方法
    //  * @author yrj 2022-02-28
    //  */
    // extendThingMethod() {
    //     if (this.isExtend) {
    //         return;
    //     }
    //     const clsMethod = THING.factory.classes.Thing;
    //     const obj = deployExtendThing;
    //     const keys = Object.keys(obj);
    //     keys.forEach((name) => {
    //         clsMethod.prototype[name] = obj[name];
    //     });
    //     this.isExtend = true;
    // }
};
export default defaultInit;
