/*
 * @Description:初始化一些xxv的配置
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-03-04 15:17:23
 * @LastEditors: yls
 * @LastEditTime: 2022-03-10 14:06:16
 */
import BaseConfig from '@/utils/defaultUtils/base';
export default class initFun {
    constructor() {
        this.init();
    }
    init() {
        new BaseConfig(true);
    }
}
