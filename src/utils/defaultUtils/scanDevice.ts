/*
 * @Author: YangQi
 * @Date: 2022-03-07 10:15:43
 * @Last Modified by: YangQi
 * @Last Modified time: 2022-03-07 10:55:36
 */
/**
 * 扫描设备
 */
import { getLinkDevice } from '../api/defaultApi/index';
export default function scanDevice(
    id:string, targetTwinClassIds:string, radius:Number, flag:Boolean, callback:Function
) {
    const cb = callback || function () {};
    const userData=uino.app.query(`#${id}`)[0];
    if (!userData) return;
    const params={
        originPosition1: userData.position[0],
        originPosition2: userData.position[1],
        originPosition3: userData.position[2],
        // originUuid: userdata.uuid,
        sceneId: uino.sceneId,
        targetTwinClassIds: targetTwinClassIds,
        parentId: 0,
        radius: radius
    };
    if (!flag) {
        getLinkDevice(params).then(()=>{
            cb();
        });
    } else {
        uino.app.create({
            type: 'Thing',
            // id: 'CameraAnimate',
            name: 'CameraAnimate',
            url: '/static/product_lib_camera_gltf/3dee233d763b4e0aa9fd548c7f3fbd67/',
            size: 0.3,
            scale: [0.2, 0.2, 0.2],
            localPosition: [0, 1, 0],
            parent: userData,
            inheritStyle: false,
            inheritPickable: false,
            style: {
                opacity: 0.8,
                color: 'red',
                alwaysOnTop: true
            },
            complete: ()=>{
                getLinkDevice(params).then(()=>{
                    cb();
                });
            }
        });
    }
}
