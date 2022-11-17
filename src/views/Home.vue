<!--
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-09-14 10:02:34
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-11-17 18:34:18
 * @FilePath: \box-selection\src\views\Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="load-map-twin">
        <div id = "div3d"></div>
    </div>
</template>

<script  lang='ts'>
import { defineComponent } from 'vue';
import sceneMain from '@/baseTi/utils/scene';
import { loadScript } from '@/baseTi/utils/loadXxvFileCfg';
import CameraView from '@/baseTi/utils/map/cameraView';
import { useMainStore } from '../store';
import initx from './rivers/index';

export default defineComponent({
    name: '',
    components: {},
    data() {
        return {
            mainStore: {},
            mapInfo: {},
            center: [116.04451959795412, 40.32241166693724]
        };
    },
    // 方法集合
    methods: {
        getlanlog(x: number, y:number) {
            const screen = [x, y];
            // 世界坐标
            const world = CMAP.Util.convertWindowToWorld(screen);
            // 经纬度
            const lonlat = CMAP.Util.convertWorldToLonlat(world);
            const target = {
                screen,
                world,
                lonlat
            };
            console.log('jzk word', lonlat, target);
        },
        loadMap() {
            const that = this;
            const mapIntance = new sceneMain.MapController({
                container: 'div3d',
                background: '#000',
                openEarth: false,
                scriptLoaded() {
                    loadScript('/static/js/uearth.min.v1.7.8.23.js', ()=>{
                        mapIntance.createMap({
                            url: '/map/main/map.json',
                            resourcePrefix: '/map/main',
                            tileLayerUrl: '',
                            mapLoaded() {
                                window.uino.app.on('click', (e: any) => {
                                    that.getlanlog(e.x, e.y);
                                });
                                that.setMapCamView();
                                initx();
                            }
                        });
                    });
                }

            });
            window.uino = mapIntance;
        },
        setMapCamView() {
            this.mapInfo = new CameraView('高德地图-卫星');
        }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.mainStore = useMainStore();
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.loadMap();
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
