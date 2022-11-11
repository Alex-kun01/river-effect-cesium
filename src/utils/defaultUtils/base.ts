/*
 * @Description:基础配置
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-03-03 14:34:30
 * @LastEditors: yls
 * @LastEditTime: 2022-04-24 14:48:19
 */
import { sysConfig, sysMenu } from '@/api/defaultApi/index';
import { getCaptchaImage } from '@/api/defaultApi/login';
import { useMainStore } from '@/store';
import { MenuState, CaptimageState } from '@/store/types';
export default class baseConfig {
    menuData:any[]
    baseStore:any
    constructor(captImg?:boolean) {
        this.menuData = [];
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
        sysConfig().then((res:any)=>{
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

    getMenu() {
        return new Promise<any>((resolve, reject)=>{
            sysMenu().then((res:any) => {
                if (res.code === 200 && res.data) {
                    const menuData = res.data.children;
                    this.find(menuData);
                    resolve(this.menuData);
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
        getCaptchaImage().then((res:any) => {
            const codeData = res.data;
            const imgData:CaptimageState = {
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
    find(arr:any, id?:number|string) {
        arr.forEach((item:any) => {
            const menuList:MenuState = {
                title: item.title,
                twinXxv: item.twinXxv.map((ele:any) => ele.id),
                id: item.id,
                code: item.code
            };
            if (item.pid === id) {
                const t = this.menuData.filter((it:any)=>it.id === id);
                if (t.length>0) t[0].children.push(menuList);
            } else {
                menuList.children = [];
                this.menuData.push(menuList);
            }
            if (item.children && item.children.length > 0) {
                this.find(item.children, item.id);
            }
        });
    }
}
