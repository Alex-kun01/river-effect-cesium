/*
 * @Description: 地球飞行事件
 * @Version: 1.0
 * @Autor: hasaiki
 * @Date: 2022-05-26 10:33:25
 * @LastEditors: hasaiki
 * @LastEditTime: 2022-05-27 10:08:04
 */
type FlyOptions = {
  time?: number, // 飞行时间ms 默认 2000
  heading?: number, // 水平角(方位角) 单位度 默认0
  pitch?:number, // 垂直角(俯仰角) 单位度 默认 45
  disablePick?: boolean, // 是否关闭pick 默认true
  height?:number, // 摄影机离地高度 默认200
  directFly?: boolean, // 是否沿着直线飞行，不优化路线(可能穿地球而过) 默认false
}
export default class EarthFly {
    constructor() {
    }
    /**
     * @description 地球飞行方法
     * @author hasaiki
     * @date 2022/05/26
     * @export
     * @param {*} data baseX返回的孪生体数据
     * @param {FlyOptions} [options] 飞行参数
     * @param {Function} [cb] 飞行完毕回调
     */
    flyTo(data:any, options?:FlyOptions, cb?:Function) {
        if (!window.uino || !window.uino.app || !data) return;
        const cbData = JSON.parse(data.cb_data);
        if (!cbData) return;
        if (cbData.camera && JSON.stringify(cbData.camera)!== '{}') {
            // 飞到设置的视角
            EarthFly.flyToSetting(cbData.camera, options, cb);
        } else {
            // 飞到默认视角
            const model = window.uino.app.query(`#${data.uuid}`)[0];
            if (model) {
                // 参数处理
                const time = (options && options.time)?options.time:2000;
                const heading = (options && options.heading)?options.heading:0;
                const pitch = (options && options.pitch)?options.pitch:45;
                const disablePick = (options && options.disablePick)?options.disablePick:true;
                const height = (options && options.height)?options.height:200;
                const directFly = (options && options.directFly)?options.directFly:false;
                window.uino.app.camera.earthFlyTo({
                    object: model,
                    time,
                    heading,
                    pitch,
                    disablePick,
                    height,
                    directFly,
                    complete() {
                        if (cb) cb();
                    }
                });
            } else {
                console.error('对象不存在');
            }
        }
    }
    /**
     * @description 根据点位uuid定位
     * @author hasaiki
     * @date 2022/05/27
     * @param {string} uuid 孪生体uuid
     * @param {FlyOptions} [options] 自定义参数
     * @param {Function} [cb] 飞行完毕回调
     * @memberof EarthFly
     */
    flyToByUuid(uuid:string, options?:FlyOptions, cb?:Function) {
        if (!window.uino || !window.uino.app || !uuid) return;
        const model = window.uino.app.query(`#${uuid}`)[0];
        if (model) {
            const userData = model.userData;
            if (userData && userData.camera && JSON.stringify(userData.camera)!== '{}') {
                // 飞到设置的视角
                EarthFly.flyToSetting(userData.camera, options, cb);
                return;
            }
            // 飞到默认视角
            // 参数处理
            const time = (options && options.time)?options.time:2000;
            const heading = (options && options.heading)?options.heading:0;
            const pitch = (options && options.pitch)?options.pitch:45;
            const disablePick = (options && options.disablePick)?options.disablePick:true;
            const height = (options && options.height)?options.height:200;
            const directFly = (options && options.directFly)?options.directFly:false;
            window.uino.app.camera.earthFlyTo({
                object: model,
                time,
                heading,
                pitch,
                disablePick,
                height,
                directFly,
                complete() {
                    if (cb) cb();
                }
            });
        } else {
            console.error('对象不存在');
        }
    }
    /**
   * @description 飞到baseX设置的视角
   * @author hasaiki
   * @date 2022/05/26
   * @param {*} camera baseX返回的camera数据
   * @param {FlyOptions} [options] 飞向参数：飞到默认视角时只取time
   * @param {Function} [cb] 飞行完毕回调
   * @memberof earthFly
   */
    static flyToSetting(camera:any, options?:FlyOptions, cb?:Function) {
        const time = (options && options.time)?options.time:2000;
        if (!camera.target || !camera.postion) return;
        window.uino.app.camera.flyTo({
            target: camera.target,
            position: camera.position,
            time: time,
            isEarth: true,
            complete() {
                if (cb) cb();
            }
        });
    }
}
