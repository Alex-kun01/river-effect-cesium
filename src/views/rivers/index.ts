/*
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-11-11 13:56:05
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-11-17 18:22:50
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

const createGroundGeoPolygon = () => {
    const area = new THING.EARTH.GeoGroundPolygon({
        name: 'test',
        coordinates: testPoints,
        offsetHeight: 5000,
        // maxHeight: 8000,
        // minHeight: 0,
        style: {
            color: [0, 1, 0], // 面填充颜色
            opacity: 0.8, // 填充不透明度
            outline: {
                color: [1, 1, 0], // 边框色
                width: 2 // 边框宽度
            }
        }
    });
};

export default function createRivers() {
    // 创建一个 ThingLayer
    const waterLayer = new THING.EARTH.ThingLayer({
        name: 'thingLayer01'
    });
    // 将ThingLayer添加到地图中
    uino.map.addLayer(waterLayer);

    const water = new THING.EARTH.GeoWater({
        name: 'water',
        coordinates: testPoints,
        style: {
            color: [0, 0.1, 0.5],
            opacity: 1,
            normalMap: {
                url: 'https://www.thingjs.com/uearth/res/waternormals.jpg',
                speed: [80, 0]
            },
            envMap: {
                url: ['https://www.thingjs.com/uearth/res/BlueSky/posx.jpg',
                    'https://www.thingjs.com/uearth/res/BlueSky/negx.jpg',
                    'https://www.thingjs.com/uearth/res/BlueSky/posy.jpg',
                    'https://www.thingjs.com/uearth/res/BlueSky/negy.jpg',
                    'https://www.thingjs.com/uearth/res/BlueSky/posz.jpg',
                    'https://www.thingjs.com/uearth/res/BlueSky/negz.jpg'],
                intensity: 1.0
            },
            waveAmplitude: 1.0,
            twistAmplitude: 1.0
        }
    });
    waterLayer.add(water);
}
