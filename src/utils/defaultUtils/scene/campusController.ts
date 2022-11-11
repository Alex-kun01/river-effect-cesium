/**
 * @description: 园区控制器：
 * 1.获取basex场景列表
 * 2.加载主场景
 * 3.根据参数判断是否需要一次性加载出子场景->不需要加载子场景的，动态切换加载
 * option:{
 *  container:场景dom容器
 *  sceneName:场景名称
 *  openEarth：使用uearth
 *  openEffact: 使用效果包
 *  thingOpt: 初始化app的配置项
 * }
 */

import { getScene, getSceneList } from '@/api/defaultApi/scene';
// import { loadJsFiles } from '@/utils/utils';
import { useMainStore } from '@/store';
import SceneBase from './sceneBase';
import {
    CampusAddOpts, CampusBaseOpts, Aobject
} from './type';

const tips = {
    paramsError: '请传入正确的参数'
};
let mainStore: any = null;
export default class CampusController extends SceneBase {
  // app: any // thingjs示例对象
  option: CampusBaseOpts & CampusAddOpts// 初始化配置项
  sceneList: any[] = [] // 已启用的场景列表
  curCampus: any
  campusMap: any // 加载的场景信息数据
  // loadedCallBack:Function
  //   loaddingComponent:any
  constructor(option: CampusBaseOpts & CampusAddOpts) {
      const {
          container, background, openEffact, openEarth
      } = option;
      if (!container) throw new Error('容器dom参数丢失');
      const baseOpts:Aobject & {container:string}= {
          container
      };
      // 重写回调
      const callback:()=>void = ()=>{
          this.init();
      };
      background && (baseOpts.background= background);
      openEffact && (baseOpts.openEffact= openEffact);
      openEarth && (baseOpts.openEarth= openEarth);
      baseOpts.scriptLoaded= callback;
      super(baseOpts);
      mainStore = useMainStore();
      this.option = option;
  }

  async init() {
      // 获取已启用的场景列表
      const res: any = await getSceneList();
      if (res.code === 200) {
          this.sceneList = res.data;
          this.loadCurrentScene();
      }
  }

  /**
   * @description:加载前端资源js文件并加载场景
   */
  loadCurrentScene() {
      const { sceneName, scriptLoaded } = this.option;
      // 等待场景列表获取完成 再执行js完成回调
      scriptLoaded && scriptLoaded();

      // 如果没有主场景名称 则不进行场景请求及加载操作
      if (sceneName) {
          this.loadMainCampus();
      }
  }
  /**
   * @description: 加载主场景
   * @param {any} opts
   *
   */
  loadMainCampus(opts?:CampusAddOpts) {
      const that = this;
      const combineOpts = { ...this.option, ...opts };
      this.option = combineOpts;
      const {
          lon, lat, angle, sceneName, thingOpt, initChildScene, sceneLoaded
      } = this.option;

      const { config } = window;
      const scene = that.sceneList.find((it) => it.name === sceneName);
      if (!scene) {
          throw new Error(`${tips.paramsError},没有找到"${sceneName}"场景`);
      } else {
          // 存储主场景
          mainStore.setMainScene(scene);
      }
      // 获取场景信息
      getScene({ uuid: mainStore.mainScene.uuid, flag: false }).then((response: any) => {
          if (response.code === 200) {
              this.campusMap = response.data;
              mainStore.setSceneTree(this.campusMap);
              let scenePos = {};
              // 只加载园区
              setTimeout(()=>{
                  // 如果有场景对场景的位置进行转换
                  (lon && lat) && (scenePos = CampusController.convertPosition([lon, lat], angle));
                  that.createCampus({ ...{
                      url: `${config.previewSceneURL}${mainStore.mainScene.url}`,
                      loaderResourceUrl: `${config.previewModelUrl}`,
                      name: sceneName,
                      ...scenePos
                  }, ...thingOpt },
                  (event:Aobject) => {
                      initChildScene &&that.loadWholeChildScene();
                      that.campusLoad(event.object);
                      sceneLoaded && sceneLoaded(event.object);
                  });
              }, 5000);
          }
      });
  }

  /**
   * @description: 加载所有的子场景
   */
  loadWholeChildScene() {
      const that = this;
      const { childSceneLoaded } = this.option;
      this.campusMap.children.forEach((item:Aobject, index:number) => {
          const buildingMain = this.app.query(`##${item.campusBuilderId}`)[0];
          if (item.childrenSceneUUID && item.facades) {
              buildingMain.floors.destroyAll();
              // 动态创建园区
              that.createCampus({ url: window.config.previewSceneURL + item.url }, (e:Aobject) => {
                  const campusTmp = e.object;
                  const buildingTmp = campusTmp.buildings[0];
                  buildingTmp.floors.forEach((floor:Aobject) => {
                      buildingMain.add({
                          object: floor,
                          // 设置相对坐标，楼层相对于建筑的位置保持一致
                          localPosition: floor.localPosition
                      });
                  });

                  if (index === that.campusMap.children.length-1) {
                      childSceneLoaded && childSceneLoaded(e.object);
                  }
                  // 楼层添加后，删除园区以及内部的园区建筑
                  buildingTmp.destroy();
                  campusTmp.destroy();
                  that.app.resumeEvent(THING.EventType.EnterLevel, '.Building', THING.EventTag.LevelFly);
              });
          }
      });
  }

  /**
   * @description: 注册场景事件
   * @param  {object} event : thingjs回调函数传入对象
   */
  campusLoad(event: any) {
      // 园区初始化
      const campus = event;
      const that = this;
      const {
          buildinghoverColor, container, initChildScene
      } = that.option;
      that.app.level.options.autoChangeBackground = false;
      THING.App.current.level.options.autoBakeFloor = false;
      // 开启默认的层级控制
      that.app.level.change(campus);
      // 未知
      that.app.query('.Thing').forEach((item:Aobject) => {
          if (item.userData.type !== 'InfoPoint') {
              // eslint-disable-next-line
              item.pickable = false
          }
      });

      campus.userData.isMainScene = true;
      // 获取园区中的建筑
      const building = that.app.query('.Building');
      // 获取到所有需要修改勾边颜色的对象
      const pickThing = that.app.query('.Campus')[0].things.filter((item:Aobject) => item.pickable);
      const pickBuilding = pickThing.add(building);
      if (!initChildScene) {
          // 园区加载完成后，将园区中建筑下的楼层删除（Floor）
          for (let i = 0; i < building.length; i += 1) {
              const index = this.campusMap.children.findIndex((item:Aobject) => item.campusBuilderId === building[i].uuid);
              if (
                  index > 0 &&
              this.campusMap.children[index].childrenSceneUUID !== null &&
              this.campusMap.children[index].facades
              ) {
                  building[i].floors.destroy();
              }
          }
      }

      // 双击右键退出
      that.app.pauseEvent(THING.EventType.Click, null, THING.EventTag.LevelBackOperation);
      that.app.on(THING.EventType.DBLClick, (ev:Aobject) => {
          if (ev.button === 2 && that.app.level.current.type !== 'Campus') {
              that.app.level.back();
          }
      });

      // 存储当前场景id和code
      mainStore.$patch({
          currentSceneId: mainStore.mainScene.uuid,
          currentSceneCode: this.campusMap.sceneCode
      });
      // 修改建筑勾边颜色
      pickBuilding.on('mouseenter',
          (ev:Aobject) => {
              const evt = ev;
              evt.object.style.outlineColor = buildinghoverColor || '#ecf3c0';
              const obj = document.getElementById(container);
              if (obj) {
                  obj.style.cursor = 'pointer';
              }
          },
          'enterBuildingOutlineColor');
      pickBuilding.on('mouseleave',
          (ev:Aobject) => {
              const evt = ev;
              const obj = document.getElementById(container);
              if (obj) {
                  obj.style.cursor = document.getElementsByTagName('body')[0].style.cursor;
              }
              evt.object.style.outlineColor = null;
          },
          'leaveBuildingOutlineColor');
      // this.resetBreadcrumb();
      // const outdoorInfo = this.campusMap.children.filter(item => item.dataType === 'outdoors')[0];
      // if (outdoorInfo && outdoorInfo.configCamInfo) {
      //     this.flyTo(outdoorInfo);
      // }

      // 监听场景层级切换更新面包屑并且保存层级状态
      that.app.on(
          THING.EventType.LeaveLevel, '*', () => {}, '更新面包屑'
      );

      // 监听退出建筑层级事件
      that.app.on(
          THING.EventType.LeaveLevel,
          '.Building',
          (ev:Aobject) => {
              const { current, previous } = ev;
              const {
                  unexpandfloorComplete, expandfloorDistance, initChildScene
              } = that.option;
              // 删除退出的建筑中楼层鼠标滑过的顶牌和沟边颜色事件
              const floors = previous.query('.Floor');
              floors.off('mouseleave', null, 'mouseLeaveFloor');
              floors.off('mouseenter', null, 'mouseEnterFloor');
              if (expandfloorDistance) {
                  ev.object.unexpandFloors({
                      'time': 500,
                      complete: ()=>{
                          unexpandfloorComplete && unexpandfloorComplete();
                      }
                  });
              }

              if (current.type === 'Campus') {
                  // 由建筑回到园区
                  mainStore.$patch({
                      currentSceneId: mainStore.mainScene.uuid,
                      currentSceneCode: this.campusMap.sceneCode
                  });
                  // 恢复建筑沟边事件事件
                  pickBuilding.resumeEvent('mouseenter', null, 'enterBuildingOutlineColor');
                  pickBuilding.resumeEvent('mouseleave', null, 'leaveBuildingOutlineColor');
                  if (initChildScene) return;// 初始化加载了子场景，退出楼层则不销毁楼层
                  const bd = ev.previous; // 获取之前的层级
                  if (!bd) return;
                  // eslint-disable-next-line no-underscore-dangle
                  bd._isAlreadyBuildedFloors = false;
                  if (bd.floors) {
                      const index = this.campusMap.children.findIndex((item:Aobject) => item.campusBuilderId === bd.uuid);
                      if (index > 0 && this.campusMap.children[index].childrenSceneUUID !== null) {
                          bd.floors.destroy();
                      }
                  }
              }
          },
          '退出建筑时卸载建筑下的楼层'
      );

      // 监听进入建筑层级事件
      that.app.on(
          THING.EventType.EnterLevel,
          '.Building',
          (event:Aobject) => {
              const ev = event;
              that.app.resumeEvent(THING.EventType.EnterLevel, '.Building', THING.EventTag.LevelFly);

              const {
                  childSceneLoaded, expandfloorDistance, initChildScene, expandfloorComplete
              } = that.option;
              const { object: buildingMain, previous: preObject } = ev; // 获取当前建筑对象
              const eventSetting = (floors:Aobject)=>{
                  // 暂停建筑沟边颜色改变事件
                  pickBuilding.pauseEvent('mouseenter', null, 'enterBuildingOutlineColor');
                  pickBuilding.pauseEvent('mouseleave', null, 'leaveBuildingOutlineColor');
                  // 楼层进入进出设置外边框
                  this.floorsEvent(floors);
              };
              const { floors } = buildingMain;
              eventSetting(floors);
              if (expandfloorDistance) {
                  buildingMain.expandFloors({
                      distance: expandfloorDistance,
                      horzMode: false, // 填 true 时为横向展开楼层
                      complete: ()=>{
                          expandfloorComplete && expandfloorComplete();
                      }
                  });
              }
              if (initChildScene) return;// 初始化加载了子场景，进入建筑则不创建子场景
              // 如果是从楼层退出 进入Building的 则不做操作
              if (preObject instanceof THING.Floor) {
                  this.floorsEvent(floors);
                  return;
              }
              let mapItem: any = null;
              this.campusMap.children.some((item:Aobject) => {
                  if (item.campusBuilderId === buildingMain.uuid.toString()) {
                      mapItem = item;
                      return true;
                  }
                  return false;
              });
              // 判断是子场景建筑还是模模搭搭建的建筑
              if (mapItem && mapItem.childrenSceneUUID && mapItem.facades) {
                  // 暂停进入建筑时的默认飞行操作，等待楼层创建完成
                  that.app.pauseEvent(THING.EventType.EnterLevel, '.Building', THING.EventTag.LevelFly);
                  // 暂停单击右键返回上一层级功能
                  that.app.pauseEvent(THING.EventType.Click, '*', THING.EventTag.LevelBackOperation);

                  // 动态创建园区
                  that.createCampus({ url: window.config.previewSceneURL + mapItem.url }, (e:Aobject) => {
                      const campusTmp = e.object;
                      const buildingTmp = campusTmp.buildings[0];
                      buildingTmp.floors.forEach((floor:Aobject) => {
                          buildingMain.add({
                              object: floor,
                              // 设置相对坐标，楼层相对于建筑的位置保持一致
                              localPosition: floor.localPosition
                          });
                      });
                      childSceneLoaded && childSceneLoaded(e.object);
                      if (expandfloorDistance) {
                          buildingMain.expandFloors({
                              distance: expandfloorDistance,
                              horzMode: false, // 填 true 时为横向展开楼层
                              complete: ()=>{
                                  expandfloorComplete && expandfloorComplete();
                              }
                          });
                      }
                      const floors = that.app.level.current.query('.Floor');
                      eventSetting(floors);
                      // 楼层添加后，删除园区以及内部的园区建筑
                      buildingTmp.destroy();
                      campusTmp.destroy();
                      // loadingPanel.visible = false;

                      // 恢复默认的进入建筑飞行操作
                      that.app.resumeEvent(THING.EventType.EnterLevel, '.Building', THING.EventTag.LevelFly);
                      // 恢复单击右键返回上一层级功能
                      that.app.resumeEvent(THING.EventType.Click, '*', THING.EventTag.LevelBackOperation);

                      // 这一帧内 暂停自定义的 “进入建筑创建楼层” 响应
                      that.app.pauseEventInFrame(THING.EventType.EnterLevel, '.Building', '进入建筑创建楼层');
                      // 触发进入建筑的层级切换事件 从而触发内置响应
                      buildingMain.trigger(THING.EventType.EnterLevel, ev);
                      mainStore.$patch({
                          currentSceneId: mapItem.parentSceneUUID,
                          currentSceneCode: mapItem.sceneCode
                      });
                  });
              }
          },
          '进入建筑创建楼层',
          51
      );

      // 监听进入房间事件
      that.app.on(
          THING.EventType.EnterLevel,
          '.Room',
          (e:Aobject) => {
              const room = e.object;
              room.plan.style.color = '#ffff00';
          },
          '进入房间设置边框颜色'
      );

      // 监听离开房间事件
      that.app.on(
          THING.EventType.LeaveLevel,
          '.Room',
          (e:Aobject) => {
              const room = e.object;
              room.plan.style.color = null;
          },
          '离开房间取消边框颜色'
      );

      that.app.on(THING.EventType.LevelChange, (ev:Aobject)=>{
          setTimeout(()=>{
              that.dBLClickFly(ev.current);
          }, 0);
      });

      // // 监听层级切换
      // that.app.on(
      //     THING.EventType.DBLClick,
      //     '.Room || .Building ||.Floor',
      //     (e:Aobject) => {
      //         console.log(e.object);
      //         this.dBLClickFly(e);
      //     },
      //     'levelMonitoring'
      // );
  }

  createCampus(obj: Aobject, callback: Function) {
      this.curCampus = this.app.create({
          ...{
              type: 'Campus',
              // url: obj.url,
              position: [0, 0, 0],
              visible: false, // 创建园区过程中隐藏园区
              complete: function (ev: Aobject) {
                  callback(ev);
              }
          },
          ...obj
      });
  }
  /**
   * @description: 双击建筑飞入设置视角
   * @param {Object} e: thingjs query出来对象
   */
  dBLClickFly(e:Aobject) {
      const nodes: Aobject[] = this.flatten(this.campusMap.children);
      // const toData = nodes.find((node) => node.campusBuilderId === e.object.uuid.toString());
      const toData = nodes.find((node) => node.campusBuilderId === e.uuid.toString());
      if (!toData) return;
      const toCamInfo = toData.configCamInfo;
      const to = JSON.parse(toCamInfo);
      this.eyeFly(to);
  }

  // 扁平化处理场景树
  flatten(arr:any[]):any[] {
      return [].concat(...arr.map((item) => (item.children ? [].concat(item, ...this.flatten(item.children)) : [].concat(item))));
  }

  // 视角飞入
  eyeFly(e:Aobject) {
      if (e && e.eye && e.target) {
          const positionArr = typeof e.eye === 'string' ? e.eye.replace(' ', ',').split(',') : e.eye;
          const targetArr = typeof e.target === 'string' ? e.target.replace(' ', ',').split(',') : e.target;
          const position:number[]= [];
          const target:number[]= [];
          positionArr.forEach((item:string) => position.push(Number(item)));
          targetArr.forEach((item:string) => target.push(Number(item)));

          this.app.camera.flyTo({
              position,
              target,
              radius: e.distance,
              time: 0
          });
      }
  }

  // 进入建筑后给楼层添加鼠标滑过的顶牌和沟边颜色事件
  floorsEvent(floors:Aobject) {
      const that = this;
      const {
          floorHoverColor, floorHoverCallback, floorLeaveCallback
      } = that.option;
      floors.on('mouseenter',
          (e1:Aobject) => {
              const { object } = e1;
              const {
                  name, id, uuid
              } = object;
              object.style.outlineColor = floorHoverColor || '#ecf3c0';
              const obj = document.getElementById(this.option.container);
              if (obj) {
                  obj.style.cursor = 'pointer';
              }
              floorHoverCallback && floorHoverCallback({
                  id,
                  uuid,
                  name
              }, e1);
              //   const f = evt.object;
              //   let txt = '';
              //   this.campusMap.children.some((item) => {
              //       if (item.campusBuilderId === f.uuid) {
              //           txt = item.settingName ? item.settingName : item.name;
              //           return true;
              //       }
              //       return false;
              //   });
              //   window.uino.topMarkerController.initFloorMarker(evt, txt);
          },
          'mouseEnterFloor');
      floors.on('mouseleave',
          (e1:Aobject) => {
              const { object } = e1;
              const {
                  name, id, uuid
              } = object;
              object.style.outlineColor = null;
              const obj = document.getElementById(this.option.container);
              if (obj) {
                  obj.style.cursor = document.getElementsByTagName('body')[0].style.cursor;
              }
              floorLeaveCallback && floorLeaveCallback({
                  id,
                  uuid,
                  name
              }, e1);
          },
          'mouseLeaveFloor');
  }

  // 获取转换后得到的世界坐标
  static convertPosition(lonlat:[number, number], agl:number = 0) {
      const position = CMAP.Util.convertLonlatToWorld(lonlat, 0);
      const angles = CMAP.Util.getAnglesFromLonlat(lonlat, agl);
      return { position, angles };
  }
}
