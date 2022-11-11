/*
 * @Description:
 * @Version: 1.0
 * @Autor: lxy
 * @Date: 2022-06-07 10:36:44
 * @LastEditors: lxy
 * @LastEditTime: 2022-06-07 10:36:45
 */
/*
 * @Description:基础配置
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-03-03 14:34:30
 * @LastEditors: yls
 * @LastEditTime: 2022-06-06 10:52:48
 */
import {
    sysConfig, sysMenu, getCaptchaImage, getLegendMenu, getSelectTwin
} from '@/baseTi/api';
import { useMainStore } from '@/baseTi/store';
import { CaptimageState } from '@/baseTi/store/types';
import _ from 'lodash';
export default class baseConfig {
    menuData: any[]
    baseStore: any
    legendData:any // 图例数据
    constructor(captImg?: boolean) {
        this.menuData = [];
        this.legendData = [];
        this.baseStore = {};
        if (captImg) {
            this.init();
        }
    }
    /**
     * @description: 初始化
     */
    async init() {
        if (window.configXxv) {
            if (window.configXxv.BEI_JING_YAN_SE) {
                document.getElementsByTagName('body')[0].style.background = window.configXxv.BEI_JING_YAN_SE;
            }
            useMainStore().setConfigInf(window.configXxv);
        } else {
            await this.getConfig();
            this.getCaptmage();
        }
    }
    /**
     * @description: 从basex获取config配置放
     */
    getConfig() {
        sysConfig().then((res: any) => {
            window.configXxv = res.data;
            if (window.configXxv.BEI_JING_YAN_SE) {
                document.getElementsByTagName('body')[0].style.background = window.configXxv.BEI_JING_YAN_SE;
            }
            useMainStore().setConfigInf(res.data);
        });
    }
    /**
     * @description: 从basex获取xxv菜单放到pinia中
     */

    async getMenu() {
        // 获取图例
        const legendData:any = await getLegendMenu();
        if (legendData.code === 200 && !_.isEmpty(legendData.data.rows)) {
            this.legendData = legendData.data.rows;
        }
        return new Promise<any>((resolve, reject) => {
            sysMenu().then((res: any) => {
                if (res.code === 200 && res.data) {
                    const menuData = res.data.children;
                    this.find(menuData);
                    resolve(menuData);
                } else {
                    reject(new Error());
                }
            });
        });
    }

    /**
     * @description: 获取菜单图例数据
     * @param {string|number} menuId: 参数
     * @param {boolean} flat:是否需要展开图例的孪生体信息
     */

    getLegen(legendId:string|number, flat:boolean= true) {
        let twinArr:any[] = [];
        return new Promise<any>((resolve, reject) => {
            const param = {
                legendId: legendId || ''
            };
            getSelectTwin(param).then((res: any) => {
                if (res.code === 200 && res.data) {
                    const legenVal = res.data;
                    if (!_.isEmpty(legenVal.twinList) && flat) {
                        // 返回该图例关联的所有孪生体相关信息
                        twinArr = legenVal.twinList.map((it: any) => it.twinDateList).flat();
                        resolve(twinArr);
                    } else {
                        // 返回该图例所有信息
                        resolve(legenVal);
                    }
                } else {
                    reject(new Error());
                }
            });
        });
    }

    /**
     * @description: 登录需要获取的验证码
     */
    getCaptmage() {
        getCaptchaImage().then((res: any) => {
            const codeData = res.data;
            const imgData: CaptimageState = {
                codeData: `data:image/gif;base64,${codeData.img}`,
                uuid: codeData.uuid
            };
            useMainStore().setCaptimage(imgData);
        });
    }
    /**
     * @description: 递归处理接口返回的菜单栏信息
     * @param {any} arr
     * @param {number} id
     */
    find(arr: any) {
        arr.forEach((item:any) => {
            const legArr = _.isEmpty(this.legendData) ? []:this.legendData.filter((it: any) => it.menuId === item.id || it.menuId === '-1');
            item.twinXxv=item.twinXxv.map((ele:any) => ele.id);
            // 绑定图例信息
            item.legendData = _.isEmpty(legArr) ? []:legArr.map((val:any) => {
                const { listTwin, ...otherParam } = val;
                return otherParam;
            });
            if (item.children && item.children.length > 0) {
                this.find(item.children);
            }
        });
    }
    deepFirstSearch(node:any) {
        let stack = [];
        const nodes = [];
        if (node) {
            stack = JSON.parse(JSON.stringify(node));
            while (stack.length) {
                // 每次取最后一个
                const item:any = stack.pop();
                const children = item.listConditional || [];
                nodes.push(item);
                // 判断children的长度
                for (let i = children.length - 1; i >= 0; i--) {
                    stack.push(children[i]);
                }
            }
        }
        return nodes;
    }
}
