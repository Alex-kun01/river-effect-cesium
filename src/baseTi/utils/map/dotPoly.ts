/*
 * @Description: 地球点位聚合
 * @Version: 1.0
 * @Autor: yangrong
 */
import Supercluster from 'supercluster';

export default class DotPoly {
  app:{}
  mapData:[]
  maxZoom
  radius
  minZoom
  minPoints
  layer
  constructor(app:any, mapData:any, options:any) {
      this.init();
      this.app = app; // 三维对象
      this.mapData = mapData; // 图层数据源映射
      this.radius = options.radius ? options.radius : 500; // 聚合半径
      this.maxZoom = options.maxZoom ? options.maxZoom: 17; // 最大层级
      this.minZoom = options.minZoom ? options.minZoom: 10; // 最小层级
      this.layer = {};
      this.minPoints = options.minPoints ? options.minPoints : 2; // 最小聚合个数
  }
  init() {
      this.listenIsInViewAndLevel();
      // const currentLevel = uino.map.currentLevel;
      this.layer = uino.app.create({
          type: 'ThingLayer',
          name: 'dataLayer'
      });
      // this.layerDataHandler(this.mapData);
  }
  mapLaerChange(level:any) {
      if (level > this.maxZoom) {
          this.mapData.forEach((un:any)=>{
              const object = uino.app.query(`#${un.id}`);
              if (object) {
                  object[0].visible = true;
                  object[1].visible = true;
              }
          });
      }
      this.layerDataHandler(this.mapData);
  }
  // 监听层级和可视范围变化
  listenIsInViewAndLevel() {
      const { app } = uino;
      const { map } = uino;
      if (!app || !map) {
          return;
      }
      let timeout:any = null;
      const that = this;
      app.on('CameraChangeEnd', () => { // 防抖处理可视区域渲染
          if (timeout) {
              clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
              that.mapLaerChange(CMAP.getCurrentMap().currentLevel);
          }, 80);
      }, 'PICTURE_LEVEL_OBSERVER');
  }
  // 创建聚合点
  createJHPoint(data:any, dots:any) {
      this.showAllTwins(dots);
      const { properties } = data; // 点位数据信息
      const { coordinates } = data.geometry; // 经纬度坐标数组
      const size = Math.abs(20 - CMAP.getCurrentMap().currentLevel); // 气泡大小
      const imgUrl = '/static/image/common/juhe.png';
      const html = `<div id="jhPoint" style="pandding：10px; color: #FFF;font-size: 18px">${properties.point_count}</div>`;
      const point = uino.app.create({
          type: 'GeoPoint',
          name: 'JHPoint',
          id: `JHPoint_${data.id}`,
          coordinates,
          userData: {
              CLSID: 'JHPoint',
              ...properties
          },
          offsetHeight: null,
          renderer: {
              type: 'image', // image代表创建图片类型的点
              url: imgUrl, // 图片的url
              size // 尺寸
          },
          infoWindow: {
              displayMode: CMAP.DisplayMode.Always, // 点击显示
              type: CMAP.InfoWindowType.Custom, // 自定义InfoWindow
              customHtml: html,
              pivot: [0.5, 0.5]
          }
          // infoWindow: CreateThing.handleInfoWindow(data, true, currentChoose, TioData),
          // complete: ev => CreateThing.handleComplete(data, ev.object, currentChoose, TioData, ifAlarm),
      });
      return point;
      // this.layer.add(point);
  }
  // 处理数据
  layerDataHandler(list:any) {
      const currentLevel = uino.map.currentLevel;
      if (currentLevel<this.maxZoom) {
          const showPoint = uino.app.query('point');
          showPoint.forEach((item:any)=>{
              item.visible = false;
          });
          const marker = uino.app.query('marker');
          marker.forEach((item:any)=>{
              item.visible = false;
          });
      }
      uino.app.query('JHPoint').destroy();
      const dotp = new Supercluster({
          radius: this.radius,
          maxZoom: this.maxZoom,
          minZoom: this.minZoom,
          minPoints: this.minPoints
      });
      const features:any = [];
      // 整理数据为可用结构，TODO：把属性塞进properties
      list.forEach((item:any) => {
          try {
              const gcj = JSON.parse(item.userData.gcj02_position);
              // const data =
              const obj = JSON.parse(JSON.stringify(item));
              features.push({
                  id: item.id,
                  type: 'Feature',
                  properties: obj,
                  geometry: {
                      type: 'Point',
                      coordinates: gcj
                  }
              });
          } catch (error) {
              // eslint-disable-next-line no-console
              console.log(error);
          }
      });
      dotp.load(features);
      // this.addLayer({
      //     layer: type,
      //     dot: dotp
      // });
      // // 根据当前层级计算聚合点
      const cluster = dotp.getClusters([-180, -85, 180, 85], uino.map.currentLevel);
      const dotArr:any = []; // 聚合点集合
      const normalDots:any = []; // 普通点集合
      cluster.forEach((item) => {
          if (item.properties.cluster) {
              dotArr.push(item);
          } else {
              normalDots.push(item);
          }
      });
      dotArr.forEach((temp:any)=>{
          this.createJHPoint(temp, normalDots);
      });
  }
  // 显示所有点位
  showAllTwins(data:any) {
      data.forEach((temp:any)=>{
          uino.app.query(`#${temp.id}`)[0].visible = true;
          uino.app.query(`#${temp.id}`)[1].visible = true;
      });
  }
}

