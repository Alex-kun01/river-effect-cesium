/*
 * @Description:鼠标触摸楼层动效
 * @Version: 1.0
 * @Autor: wl
 * @Date: 2022-03-01
 * @LastEditors: yls
 * @LastEditTime: 2022-04-21 18:03:43
 */
class floorAnimate {
    constructor() {
        this.init();
    }
    init() {
    // 鼠标移入
        window.uino.app.on(
            THING.EventType.MouseEnter, '.Floor', (ev: { object: { type: string; style: { color: string; }; }; }) => {
                if (THING.App.current.level._current.type === 'Building') {
                    if (ev.object.type === 'Floor') {// 取消鼠标移入楼层变色
                        ev.object.style.color = 'yellow';
                    }
                }
            }, 'mouseEnterFloor'
        );
        // 鼠标移出
        window.uino.app.on(
            THING.EventType.MouseLeave, '.Floor', (ev: { object: { style: { color: null; }; }; }) => {
                ev.object.style.color = null;
            }, 'mouseLeaveFloor'
        );

        // 鼠标移入
        window.uino.app.on(
            THING.EventType.MouseEnter, '.Room', (ev: { object: { type: string; style: { color: string; }; }; }) => {
                if (THING.App.current.level._current.type === 'Floor') {
                    if (ev.object.type === 'Room') {
                        ev.object.style.color = '#C16F1F';
                    }
                }
            }, 'mouseEnterRoom'
        );
        // 鼠标移出
        window.uino.app.on(
            THING.EventType.MouseLeave, '.Room', (ev: { object: { style: { color: null; }; }; }) => {
                ev.object.style.color = null;
            }, 'mouseLeaveRoom'
        );
    }
}
export default floorAnimate;
