/*
 * @Description: pinia
 * @Version: 1.0
 * @Autor: wl
 * @Date: 2022-03-01 14:38:49
 * @LastEditors: lxy
 * @LastEditTime: 2022-05-27 10:00:53
 */
import { defineStore } from 'pinia';
import { CaptimageState } from './types';
// 1. 定义容器、导出容器
// 参数1：容器的ID，必须是唯一的，后面Pinia会把所有的容器挂载到根容器
// 参数2：一些选项对象，也就是state、getter和action
// 返回值：一个函数，调用即可得到容器实例

export const useMainStore = defineStore('main', {
    // 类似于Vue2组件中的data，用于存储全局状态数据，但有两个要求
    // 1. 必须是函数，目的是为了在服务端渲染的时候避免交叉请求导致的数据状态污染
    // 2. 必须是箭头函数，这样是为了更好的 TS 类型推导
    state: ()=>{
        return {
            // info: 'pinia 可以使用',
            // count: 10,
            mainScene: {}, // 主场景信息
            // currentSceneId: '',
            // currentSceneCode: '',
            sceneTree: {}, // 场景信息
            // isGarden: true,
            clickMarkerInfo: '', // 点击的气泡
            menuData: {}, // 菜单信息
            captimage: {}, // 登录需要的验证码
            config: {} // config的配置信息
        };
    },
    // getters: {
    //     // 函数接收一个可选参数：state状态对象
    //     count10(state) {
    //         return state.count += 10;
    //     }
    // },
    actions: {
        // changeStates (num:number) {
        //     this.count += num + 2;
        //     this.info = 'actions修改数据';
        // },
        setMainScene (value:object) {
            this.mainScene =value;
        },
        setSceneTree(value:object) {
            this.sceneTree =value;
        },
        setClickMarkerInfo(value:any) {
            this.clickMarkerInfo =value;
        },
        setMenuConfig(value:any) {
            this.menuData = value;
        },
        setCaptimage(value:CaptimageState) {
            this.captimage = value;
        },
        setConfigInf(value:any) {
            this.config = value;
        }
    }
});
// 2. 使用容器中的 state
// 3. 通过 getter 修改 state
// 4. 使用容器中的 action 同步和异步请求
