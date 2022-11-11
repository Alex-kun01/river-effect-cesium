/*
 * @Description:
 * @Version: 1.0
 * @Autor: lxy
 * @Date: 2022-04-16 17:03:36
 * @LastEditors: yls
 * @LastEditTime: 2022-05-10 22:40:29
 */
import { loadJsFiles } from '@/utils/defaultUtils/utils';
import { BaseOpts } from './type';
export default class BaseObject {
  app: any // thingjs示例对象
  opts: BaseOpts// 初始化配置项
  constructor(option: BaseOpts) {
      this.opts = option;
      this.loadJs();
  }
  loadJs() {
      const {
          openEarth, openEffact, scriptLoaded
      } = this.opts;
      const code = ['thingjs'];
      openEarth ? code.push('uearth') : openEffact ? code.push('EffectThemeControl') : '';
      // 加载文件
      loadJsFiles(() => {
          this.initApp(()=>{
              scriptLoaded && scriptLoaded();
          });
      }, code);
  }
  /**
   * @description: 创建三维场景容器
   * @param {Function} callback
   */
  initApp(callback:()=>void) {
      const { container, background } = this.opts;
      this.app = new THING.App({
          container,
          background: background ? background : '#000',
          complete() {
              callback && callback();
          }
      });
      window.uino.app = this.app;
  }
}
