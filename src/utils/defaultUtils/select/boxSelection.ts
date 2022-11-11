/*
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-09-14 11:08:44
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-09-14 11:23:56
 * @FilePath: \box-selection\src\utils\defaultUtils\select\boxSelection.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const controlName = '框选控件';
export default {
    /**
     * 开始框选 调用方法开始框选
     * @param things 参与框选的物体列表（注：需要query出来的类数组）
     * @param callBack 框选结束的回调 return 框选到的物体列表
     * @return control 框选控件实例
     */
    startSelect(things: [], callBack: Function) {
        if (!window.uino || !things) return console.warn('找不到uino或者things');
        if (!window.uino.app) return console.warn('找不到app');
        const app = window.uino.app;
        // 准备工作
        // 鼠标样式
        document.body.style.cursor = 'crosshair';
        // 相机交互操作（旋转、平移、缩放）
        window.uino.app.camera.inputEnabled = false;
        // 使3D场景获得焦点
        app.focus();
        // 注册框选控件
        const control = new THING.RectangleSelectControl(things, {
            // 开始框选时的回调处理
            start: (ev: any) => {
                // 关闭摄像机默认交互
                app.camera.inputEnabled = false;
                // 清除候选集中的物体勾边
                ev.candidates.style.outlineColor = null;
            },
            // 结束框选时的回调函数
            end: () => {
                // 框选到的物体列表
                const data = control.objects;
                // 恢复摄像机默认交互
                app.camera.inputEnabled = true;
                // 重置鼠标样式
                document.body.style.cursor = 'default';
                // 移出控件
                app.removeControl(controlName);
                // 执行回调
                callBack && callBack(data);
            }
        });
        // 添加框选控件
        app.addControl(control, controlName);
        return control;
    },
    // 结束框选 手动结束框选
    endSelect() {
        // 移出控件
        window.uino.app.removeControl(controlName);
        // 重置鼠标样式
        document.body.style.cursor = 'default';
        // 相机交互操作（旋转、平移、缩放）
        window.uino.app.camera.inputEnabled = true;
    }
};
