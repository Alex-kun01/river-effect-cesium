/*
 * @Description:层级切换
 * @Version: 1.0
 * @Autor: wl
 * @Date: 2022-03-01
 * @LastEditors: yls
 * @LastEditTime: 2022-03-09 13:38:45
 */
class LevelChange {
    targetLevel: null;
    constructor() {
        this.targetLevel = null;
        this.changeEvent();
    }
    /**
    * @description 鼠标双击切换层级事件
    * @author
    */
    changeEvent() {
        window.uino.app.on(window.THING.EventType.DBLClick, (ev: { button?: any; object?: any; }) => {
            // uino.customCamera.resumeCameraVw();
            const { object } = ev;
            if (ev.button === 0) {
                window.uino.app.level.change(object);
            } else if (ev.button === 2) {
                if (window.uino.app.level.current.type === 'Campus') {
                    window.uino.app.level.change(window.uino.campus);
                }
                window.uino.app.level.back();
            }
        }, 'dbClickChange');
    }
    // 切换层级
    eventOn() {
        window.uino.app.on(window.THING.EventType.LevelChange, () => {
        }, 'enterEvent');
    }

    // 切换层级的方法
    changeLevel(level: { uuid: null; type: string; parent: { uuid: any; }; }, completeFunc: () => any) {
        // uino.customCamera.resumeCameraVw();
        this.targetLevel = level.uuid;
        const { uuid, type } = window.uino.app.level.current;
        // 如果是回退到Building层，需要回到默认视角
        if (level.type !== 'Building' &&
            // 如果跨了多层，不需要每一层都飞到默认视角
            level.parent && level.parent.uuid !== uuid &&
            // 如果是同一层级的切换（floor1 -> floor2）也需要飞到默认视角
            level.type !== type
        ) {
            window.uino.customCamera.pauseCameraVw();
        }
        window.uino.app.level.change(level, {
            complete: () => {
                completeFunc && completeFunc();
            }
        });
    }
}

export default LevelChange;
