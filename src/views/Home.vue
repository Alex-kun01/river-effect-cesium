<!--
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-09-14 10:02:34
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-11-15 18:28:09
 * @FilePath: \box-selection\src\views\Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="load-map-twin">
        <div id = "div3d"></div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { loadScript } from '@/baseTi/utils/loadXxvFileCfg';
import createRivers from './rivers/index.ts';

export default defineComponent({
    name: '',
    components: {},
    data() {
        return {
            center: [116.04451959795412, 40.32241166693724]
        };
    },
    methods: {
        // 初始化依赖
        initRelyOn() {
            const that = this;
            loadScript('/static/2.0/thing.umd.min-V2.2.0.js', ()=>{
                loadScript('/static/2.0/thing.earth.min-V2.2.0.js', ()=>{
                    that.loadMap();
                });
            });
        },
        // 初始化视角
        initVisual() {
            const that = this;
            uino.app.camera.earthFlyTo({
                lonlat: this.center,
                height: 3000,
                time: 1000,
                complete: () => {
                    that.initTerrain();
                    that.initRivers();
                }
            });
        },
        // 加载地形
        initTerrain() {
            // 创建一个ThingLayer,并添加到地图
            const thingLayer = new THING.EARTH.ThingLayer({
                name: 'thingLayer01'
            });
            uino.map.addLayer(thingLayer);
            uino.map.terrain.url = 'http://data.marsgis.cn/terrain';
        },
        // 初始化河流
        initRivers() {
            createRivers();
        },
        // 地图加载
        loadMap() {
            const that = this;
            const app = new THING.App();
            window.uino.app = app;
            app.background = [0, 0, 0];
            // 创建一个地图
            const map = new THING.EARTH.Map({
                attribution: '高德'
            });
            window.uino.map = map;

            app.on('click', (e) => {
                console.log('jzk e', e);
            });
            // 创建一个瓦片图层
            const tileLayer1 = new THING.EARTH.TileLayer({
                name: '卫星影像图层',
                url: 'https://webst0{1,2,3,4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
            });
            // 将瓦片图添加到底图图层中
            map.addLayer(tileLayer1);
            that.initVisual();
        }
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.initRelyOn();
    }
});
</script>
<style lang="scss">
.load-map-twin{
    position: relative;
    width: 100%;
    height: 100%;
      #div3d{
      width: 100%;
      height: 100%;
    }
    .select_box {
        width: 150px;
        height: 100px;
        position: absolute;
        top: 100px;
        right: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .btn {
            width: 100px;
            height: 40px;
            background-color: rgb(230, 230, 230);
            color: #000;
            font-weight: 600;
            line-height: 40px;
            text-align: center;
            cursor: pointer;

            &:hover {
                background-color: rgb(209, 209, 209);
            }
        }
    }
}
</style>
