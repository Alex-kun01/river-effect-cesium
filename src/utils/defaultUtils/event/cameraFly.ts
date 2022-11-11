/*
 * @Description:
 * @Version: 1.0
 * @Autor: lxy
 * @Date: 2022-05-18 18:42:11
 * @LastEditors: lxy
 * @LastEditTime: 2022-05-27 11:06:39
 */
import { useMainStore } from '@/store';
type FlyParams = {
  // 孪生体点位uuid
  uuid:string,
  // 孪生体点位父物体id
  parentId:string
  // none - 直接飞行到点位 default - 通过当前视角位置拉高飞到目标点
  // center - 过当前场景中心点再飞到目标点 setting - 过basex保存视角再飞到目标点
  type?:string,
  // 点位高度 只对type为default，center有用
  distance?:number,
  // 飞行时间
  time?:number,
  // 场景层级切换完成回调
  levelChangeComplete?:()=>void,
  // 飞行完成回调
  flyComplete?:()=>void
}
let mainStore: any = null;
const defaultDistance:number = 50;
export default class CameraFly {
  opts:FlyParams
  constructor(opts?:FlyParams) {
      if (opts) {
          this.opts = { type: 'default', distance: defaultDistance, time: 1, ...opts };
          opts && this.flyTo();
      } else {
          this.opts = { type: 'default', uuid: '', parentId: '', distance: defaultDistance, time: 1 };
      }

      mainStore = useMainStore();
  }

  // 如果没有加载子场景，则进入建筑触发子场景加载 再切换到楼层
  getBuildingInfo(children:any, floorId:string) {
      let parentId:any = null;
      const getFloorCameraInfo = (children:any, floorId:string)=> {
          children.forEach((item:any) => {
              if (item.dataType === 'buildings') {
                  parentId = getFloorCameraInfo(item.children, floorId);
              }
              if (item.dataType === 'plans' && item.campusBuilderId === floorId) {
              // if (item.dataType === 'plans' && item.campusBuilderId === floorId && item.parentCBID ==='20') { // 测试用
                  parentId = item.parentCBID;
                  return false;
              }
          });
          return parentId;
      };
      return getFloorCameraInfo(children, floorId);
  }

  changeLevel(parentId:string) {
      const { levelChangeComplete } = this.opts;
      const parent = uino.app.query(`##${parentId}`)[0];
      if (!parent) {
          const buildingUUid = this.getBuildingInfo(mainStore.sceneTree.children, parentId);
          const buildingObject:any = uino.app.query(`##${buildingUUid}`)[0];
          buildingObject && uino.app.level.change(buildingObject, {
              complete() {
                  const timer = setInterval(()=>{
                      const floorObject:any = uino.app.query(`##${parentId}`)[0];
                      if (floorObject) {
                          clearInterval(timer);
                          uino.app.level.change(floorObject, {
                              complete() {
                                  levelChangeComplete && levelChangeComplete();
                              }
                          });
                      }
                  }, 500);
              }
          });
      } else {
          uino.app.level.change(parent, {
              complete() {
                  levelChangeComplete && levelChangeComplete();
              }
          });
      }
  }

  flyTo(opts?:FlyParams) {
      if (opts) {
          this.opts = { ...this.opts, time: 1, distance: defaultDistance, flyComplete() {}, levelChangeComplete() {}, ...opts };
      }
      const {
          uuid, type, distance = defaultDistance, parentId, time = 1, flyComplete, levelChangeComplete
      } = this.opts;
      if (!uuid || !parentId) return;
      // 目标点位
      const targetObject:any = uino.app.query(`##${uuid}`)[0];
      // if (!targetObject) {
      //     console.warn('目标点不存在');
      //     return;
      // }
      // 飞到目标点
      const flyToTarget = (object:any, dis:number, flyEnd?:()=>void)=>{
          let tep:any = {};
          if (dis) {
              tep = {
                  radius: dis
              };
          }
          uino.app.camera.flyTo({
              object,
              ...tep,
              // time: 0,
              time: time*1000,
              complete() {
                  flyEnd && flyEnd();
                  (!flyEnd && flyComplete) && flyComplete();
              }
          });
      };
      const currentLevelObject = uino.app.level.current;
      const that = this;
      const flyToBefore = ()=>{
          if (!targetObject || !targetObject.parent) {
              this.changeLevel(parentId);
              return true;
          }
          // 飞行之前判断点位是否在当前层级内，不在，切换层级后再飞行到点位
          const { type: parentType, uuid: parentUUid } = targetObject.parent;
          const { type: currentType, uuid: currentUUid } = currentLevelObject;
          if (parentType !== currentType || parentUUid !== currentUUid) {
              let flyCompleteObj:any = {};
              const tempFlyTo = ()=>{
                  levelChangeComplete && levelChangeComplete();
                  if (type === 'setting') {
                      that.settingFly(()=>{
                          flyToTarget(targetObject, 0);
                      }, targetObject.parent, { time: 0 });
                  } else if ((type === 'center' || type === 'default') && parentType === 'Campus') {
                      flyToTarget(targetObject.parent, distance, ()=>{
                          flyToTarget(targetObject, 0);
                      });
                  } else {
                      flyToTarget(targetObject, 0);
                  }
              };
              // 层级change回到园区时，存在视角飞到园区上一次look的视角问题，暂时通过complete和flyComplete控制
              if (parentType === 'Campus') {
                  flyCompleteObj = {
                      complete() {
                          tempFlyTo();
                      }
                  };
              } else {
                  flyCompleteObj = {
                      flyComplete() {
                          tempFlyTo();
                      }
                  };
              }
              uino.app.level.change(targetObject.parent, flyCompleteObj);

              return true;
          }
          return false;
      };

      switch (type) {
          case 'none':
              if (flyToBefore()) return;
              flyToTarget(targetObject, 0);
              break;
          case 'default':
              const { position: cPostition, target: cTarget } = uino.app.camera;
              const { position } = targetObject;
              if (flyToBefore()) return;
              const bridgingPoint = [(cPostition[0]+position[0])/2, (cPostition[1]+position[1]) / 2 + distance, (cPostition[2]+position[2])/ 2];
              uino.app.camera.flyTo({
                  position: bridgingPoint,
                  target: cTarget,
                  time: time *1000,
                  // time: 500,
                  complete() {
                      flyToTarget(targetObject, 0);
                  }
              });
              break;
          case 'center':
              if (flyToBefore()) return;
              flyToTarget(currentLevelObject, distance, ()=>{
                  flyToTarget(targetObject, 0);
              });
              break;
          case 'setting':
              if (flyToBefore()) return;
              this.settingFly(()=>{
                  flyToTarget(targetObject, 0);
              }, currentLevelObject, { time: time *1000 });
              break;
          default:
              break;
      }
  }

  // 飞到物体的默认视角
  settingFly(cb:()=>void, currentLevelObject:any, ext = {}) {
      const { sceneTree } = mainStore;
      const flatten = (arr:any[]):any[]=>{
          return [].concat(...arr.map((item) => (item.children ? [].concat(item, ...flatten(item.children)) : [].concat(item))));
      };
      const nodes: any[] = flatten(sceneTree.children);
      let toData:any = null;
      if (currentLevelObject.type === 'Campus') {
          toData = nodes.find((node) => node.dataType === 'outdoors');
      } else {
          toData = nodes.find((node) => node.campusBuilderId === currentLevelObject.uuid.toString());
      }
      if (!toData) {
          cb();
          return;
      };
      const toCamInfo = toData.configCamInfo;
      const to = JSON.parse(toCamInfo);
      if ( to && to.eye && to.target) {
          const positionArr = typeof to.eye === 'string' ? to.eye.replace(' ', ',').split(',') : to.eye;
          const targetArr = typeof to.target === 'string' ? to.target.replace(' ', ',').split(',') : to.target;
          const position:number[]= positionArr.map((item:string)=>Number(item));
          const target:number[]= targetArr.map((item:string)=>Number(item));

          uino.app.camera.flyTo({
              position,
              target,
              radius: to.distance,
              ...ext,
              // time: 500,
              complete() {
                  cb();
              }
          });
      } else {
          cb();
      }
  }
}
