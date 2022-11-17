/*
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-11-11 13:56:05
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-11-17 18:35:03
 * @FilePath: \river-effect-cesium\src\views\rivers\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const testPoints = [
    [116.0296297822295, 40.33441599219302],
    [116.0456178642978, 40.342405532945],
    [116.06104749408561, 40.31459355325321],
    [116.0803159213724, 40.29753296941987],
    [116.07059743406646, 40.29207233187187],
    [116.03496881901276, 40.31773322241149]
];


export default function initx() {
    window.uino.app.create({
        type: 'GeoWater',
        name: 'save_type_name',
        coordinates: testPoints,
        renderer: {
            reflectionNormal: '/static/image/reavce.png', // 反射法线贴图
            refractionNormal: '/static/image/reavce.png', // 折射法线贴图
            reflectionImage: '/static/image/qs05.png', // 反射图
            refractionImage: '/static/image/qs05.png', // 折射图
            color: [225, 255, 255], // 水的颜色
            flowSpeed: 1// 水体流速，默认1.0
        },
        complete: ({ object }: any) => {
            window.uino.app.camera.flyTo(object);
        }
    });
}
