/*
 * @Description:鼠标触摸设备动效
 * @Version: 1.0
 * @Autor: wl
 * @Date: 2022-03-01
 * @LastEditors: yls
 * @LastEditTime: 2022-04-21 18:03:08
 */
class deviceAnimate {
    init() {
    // 鼠标左键单击设备
        window.uino.app.on(THING.EventType.Click, '.Deploy || [CLSID]', (ev: { button: number; object: { selectState: any; }; }) => {
            if (ev.button === 0 && ev.object.selectState) {
                // 点击设备飞行
                // uino.customCamera.cameraFlyToObj(param, () => {
                //     // 调用设备选中状态
                // });
            }
        });
        // 鼠标移入
        uino.app.on(
            THING.EventType.MouseEnter, '.Deploy || [CLSID]', (ev: { object: { hover: () => void; }; }) => {
                ev.object.hover();
            }, 'mouseEnterDeploy'
        );
        // 鼠标移出
        uino.app.on(
            THING.EventType.MouseLeave, '.Deploy || [CLSID]', (ev: { object: { offOut: () => void; }; }) => {
                ev.object.offOut();
            }, 'mouseLeaveDeploy'
        );
    }
}
export default deviceAnimate;
