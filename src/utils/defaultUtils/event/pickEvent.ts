/*
 * @Author: yrj
 * @Date: 2022-02-28 11:48:46
 * @LastEditTime: 2022-03-01
 */
class pickEvent {
    constructor() {
        this.defaultPick();
    }
    defaultPick() {
        uino.app.on(THING.EventType.Pick, (e: any) => {
            const ev = e;
            if (ev.object && ev.object.id && (!['Building'].includes(ev.object.type) && !ev.object.userData.CLSID)) {
                ev.object.style.outlineColor = null;
            }
        });
    }
}
export default pickEvent;
