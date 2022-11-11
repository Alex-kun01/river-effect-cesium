/*
 * @Description:模型相关事件
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-03-02 10:30:52
 * @LastEditors: lxy
 * @LastEditTime: 2022-03-24 13:40:59
 */
interface IMovePath{
  points:[][] // 运动轨迹坐标数组
  curveName?:string // 运动轨迹插值类型的曲线名称
  curveAction?:string // 运动轨迹插值类型的曲线运动方式
  time?:number // 按轨迹的运动时长
  delayTime?:number // 运动开始的延迟时间
  callback?:any // 运动轨迹完成回调函数
}

export default class modelEvent {
    modelObj:any;
    loopType:any;
    pos:any[];
    constructor(modelObj?:any) {
        this.modelObj = modelObj;
        this.loopType = {
            PingPong: window.THING.LoopType.PingPong,
            No: window.THING.LoopType.No,
            Repeat: window.THING.LoopType.Repeat
        };
        this.pos = [];
    }
    /**
     * @description: 鼠标移入移除鼠标变化
     * @param {any} data: 模型
     * @param {string} style：变化样式，默认是变手
     */
    hover(data?:any, style:string = 'pointer') {
        const modelData = data ? data : this.modelObj;
        const dom:any = document.getElementsByTagName('body')[0];
        modelData.on('mouseenter', () => {
            dom.style.cursor = style;
        }, 'mouseObjHover');
        modelData.on('mouseleave', () => {
            dom.style.cursor ='default';
        }, 'mouseObjLeave');
    }

    /**
     * @description: 模型跳动
     * @param {any} data: 模型
     * @param {any} option: 参数
     * @param {number} offs: 移动距离
     * @param {number} time: 移动的时间
     * @param {any} loopType: 循环方式
     */
    bounceTo(data?:object|object[], option:any = {}) {
        const modelData = data ? data : this.modelObj;
        if (Array.isArray(modelData)) {
            modelData.forEach((item) => {
                this.pos.push({
                    uuid: item.uuid,
                    pos: item.position
                });
                this.bounce(item, option);
            });
        } else {
            this.pos = modelData.position;
            this.bounce(data, option);
        }
    }
    /**
     * @description: 跳动
     * @param {any} modelData
     * @param {any} option
     */
    bounce(modelData?:any, option:any ={}) {
        const {
            offs = 3, time = 500, loopType
        } = option;
        modelData.moveTo({
            offsetPosition: [0, offs, 0],
            time: time,
            orientToPath: false,
            loopType: loopType ? this.loopType[loopType] : window.THING.LoopType.PingPong
        });
    }
    /**
     * @description: 停止跳动
     * @param {object} data
     */
    bounceStop(data?:object|object[]) {
        const modelData = data ? data : this.modelObj;
        if (Array.isArray(modelData)) {
            modelData.forEach((item:any) => {
                item.style.opacity = 1;
                this.pos.filter((it:any)=>it.uuid === item.uuid);
                item.position = this.pos[0].pos;
                item.stopMoving();
            });
        } else {
            modelData.position = this.pos;
            modelData.stopMoving();
        }
    }

    /**
     * @description: 模型缩放
     * @param {any} data:模型
     * @param {any} option: 参数
     * @param {number} size: 模型缩放的大小
     * @param {time} time: 循环时间
     * @param {loopType} loopType: 循环方式
     */
    scaleTo(data?:any, option:any ={}) {
        const {
            size = [1.5, 1.5, 1.5], time = 1000, loopType
        } = option;
        const modelData = data ? data : this.modelObj;
        modelData.scaleTo({
            scale: size, // 缩放倍数
            time: time, // 动画时间
            loopType: loopType ? this.loopType[loopType] : window.THING.LoopType.PingPong // 循环类型 设置循环后 无回调函数
        });
    }
    /**
     * @description: 停止缩放
     * @param {any} data
     */
    scaleStop(data?:any) {
        const modelData = data ? data : this.modelObj;
        modelData.scale = [1, 1, 1];
        modelData.stopScaling();
    }
    /**
     * @description: 闪烁
     * @param {object} data
     */
    glintTo(data?:object|object[]) {
        const modelData = data ? data : this.modelObj;
        if (Array.isArray(modelData)) {
            modelData[0].on('update', (() => {
                modelData.forEach((item:any) => {
                    this.glitStyle(item);
                });
            }), 'onUpdataGlint');
        } else {
            modelData.on('update', (() => {
                this.glitStyle(modelData);
            }), 'onUpdataGlint');
        }
    }
    glitStyle(data?:any) {
        data.style.opacity = 0.5 + 0.5 * Math.sin(2 * window.uino.app.elapsedTime / 300);
    }
    /**
     * @description: 停止闪烁
     * @param {object} data
     */
    glitStop(data?:object|object[]) {
        const modelData = data ? data : this.modelObj;
        let modelDataG = null;
        if (Array.isArray(modelData)) {
            modelDataG = modelData[0];
            modelData.forEach((item:any) => {
                item.style.opacity = 1;
            });
        } else {
            modelDataG = modelData;
            modelDataG.style.opacity = 1;
        }
        modelDataG.off('update', null, 'onUpdataGlint');
    }

    /**
     * @description: 根据路径移动
     * @param {object} data
     * @param {object} opts
     */
    movePath(data?:any, opts?:IMovePath) {
        // 默认参数
        const defaultOpts = {
            curveName: 'Linear',
            curveAction: 'None',
            time: 3,
            delayTime: 0,
            callback: null
        };
        const modelData = data ? data : this.modelObj;
        const {
            points, curveName, curveAction, time, delayTime, callback
        } = { ...defaultOpts, ...opts };
        modelData.movePath({
            // 物体移动时沿向路径方向
            orientToPath: true,
            // 路径坐标点数组
            path: points,
            // 路径总时间 毫秒
            time: time * 1000,
            // 延时 1s 执行
            delayTime,
            // 插值类型（默认为线性插值）此处设置为不插值
            lerpType: THING.LerpType[curveName][curveAction],
            complete() {
                callback && callback();
            }
        });
    }
}
