/*
 * @Description:三维里面相关的一些飞行事件
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-03-09 14:14:00
 * @LastEditors: yls
 * @LastEditTime: 2022-04-01 09:49:53
 */
export default class flyEvent {
    constructor() {
    }

    flyTo(data:any, option?:any) {
        const cbData = JSON.parse(data.userData.cbData);
        // 判断点位是否有保存的视角
        if (cbData.target) {
            this.eyeFly(cbData);
        } else {
            this.fly(data, option || {});
        }
    }

    fly(data:any, option?:any) {
        const { distance = 5, time = 100 } = option;
        window.uino.app.camera.flyTo({
            object: data,
            distance,
            time
        });
    }


    eyeFly(e:any, option?:any) {
        if (e && e.eye && e.target) {
            const { time = 100 } = option;
            const positionArr = typeof e.eye === 'string' ? e.eye.replace(' ', ',').split(',') : e.eye;
            const targetArr = typeof e.target === 'string' ? e.target.replace(' ', ',').split(',') : e.target;
            const position:any[] = [];
            const target:any[]= [];
            positionArr.forEach((item:any) => position.push(Number(item)));
            targetArr.forEach((item:any) => target.push(Number(item)));
            window.uino.app.camera.flyTo({
                position,
                target,
                time
            });
        }
    }
}
