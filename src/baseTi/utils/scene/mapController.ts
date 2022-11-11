/*
 * @Description: 地图加载类
 * @Version: 1.0
 * @Autor: lxy
 * @Date: 2022-03-03 15:16:40
 * @LastEditors: lxy
 * @LastEditTime: 2022-06-01 18:34:13
 */
// import SceneController from './CampusController';
import SceneBase from './sceneBase';
import {
    MapAddOpts, MapBaseOpts, MapConfigOpts
} from './sceneTypes';
class MapController extends SceneBase {
  map:any
  opts:MapConfigOpts
  // 定义默认参数
  defaultOpts = {
      minZoomLevel: 0,
      maxZoomLevel: 22,
      enablePan: true,
      enableRotate: true,
      enableZoom: true,
      xAngleLimitRange: [-Infinity, Infinity],
      yAngleLimitRange: [-Infinity, Infinity],
      leftInteractive: true
  }
  constructor(opts:MapConfigOpts) {
      // 重新定义scriptLoaded回调函数，当构造函数传入地图包路径则默认创建地图
      const callback:()=>void = ()=>{
          this.scriptLoaded();
          opts.scriptLoaded && opts.scriptLoaded();
      };
      // 调用父类构造函数 根据url判断是否加载uearthjs文件
      super({ openEarth: true, ...opts, scriptLoaded: callback });
      this.opts = opts;
  }

  /**
   * @description js加载成功 没有指定回调则自动创建地球， 有则执行自定义回调
   */
  scriptLoaded() {
      const {
          url, resourcePrefix, tileLayerUrl, mapLoaded
      } = this.opts;
      if (url && resourcePrefix) {
          this.createMap({ url, resourcePrefix, tileLayerUrl, mapLoaded });
      }
  }

  /**
   * @description 创建地球
   * @param {Object} opts
   * @return {Promise} 返回一个promise对象
   */
  createMap(opts:MapAddOpts) {
      const {
          url, resourcePrefix, tileLayerUrl, isProxima, ajaxAsync, mapLoaded
      } = opts;
      if (!url) {
          console.error('url参数丢失');
          return;
      }
      return new Promise((resolve, reject)=>{
          const that = this;
          try {
              this.map = this.app.create({
                  type: 'Map',
                  url,
                  resourceConfig: {
                      resourcePrefix, // 资源路径前缀
                      baseLayerUrls: tileLayerUrl?[tileLayerUrl]:[],
                      isProxima,
                      ajaxAsync
                  },
                  complete(e:any) {
                      mapLoaded && mapLoaded(e);
                      that.setMapDefaultParams({ ...that.defaultOpts, ...that.opts, ...opts });
                      resolve(e);
                  }
              });
              uino.map = this.map;
          } catch (e) {
              reject(e);
          }
      });
  }

  /**
   * @description 地图默认事件
   * @param {Object} args
   */
  setMapDefaultParams(args:MapBaseOpts) {
      const {
          minZoomLevel, maxZoomLevel, enablePan, enableRotate, enableZoom,
          xAngleLimitRange, yAngleLimitRange, leftInteractive
      } = args;
      // 设置地图的缩放层级
      (minZoomLevel !== undefined && maxZoomLevel!== undefined ) && (this.map.restrictedLevel = [minZoomLevel, maxZoomLevel]);
      // 控制平移
      (enablePan!== undefined) && (this.app.camera.enablePan = enablePan);
      // 控制俯仰
      (enableRotate!== undefined) && (this.app.camera.enableRotate = enableRotate);
      // 控制缩放
      (enableZoom!== undefined) && (this.app.camera.enableZoom = enableZoom);
      // 俯仰角度限制
      xAngleLimitRange && (this.app.camera.xAngleLimitRange = xAngleLimitRange);
      // 左右旋转角度限制
      yAngleLimitRange && (this.app.camera.yAngleLimitRange = yAngleLimitRange);
      // 鼠标左右事件互换
      (leftInteractive !== undefined) && (this.app.camera.curOrbit.leftInteractive = leftInteractive);
  }

  /**
   * @description 更换地图效果包
   * @param {Object} param
   */
  updateMapEffect({
      url, resourcePrefix, tileLayerUrl
  }:MapConfigOpts) {
      if (!url || !resourcePrefix) return;
      CMAP.Util.applyTemplate(url, {
          resourcePrefix,
          baseLayerUrls: tileLayerUrl?[tileLayerUrl]:[]
      });
      setTimeout(() => {
          const particle = this.map.query('#particleLayer');
          // 去除粒子层
          if (particle.length > 0) {
              particle.destroyAll();
          }
      }, 5000);
  }
}

export default MapController;
