/*
 * @Author: your yrj
 * @Date: 2022-03-06 15:18:49
 * @LastEditTime: 2022-05-27 11:51:12
 * @LastEditors: lxy
 * @Description: 加载场景点位
 */
import { getAllPointInfo } from '@/api/defaultApi/scene';
import { message } from 'ant-design-vue'; //
import { createBaseMarker } from '@/utils/defaultUtils/event/marker';
import Img from '@/assets/img/cameraGreen-normal.png';
class loadDevice {
  levelIdList: string[];
  timer: NodeJS.Timeout | NodeJS.Timer | null;
  createIds: string[];
  length: number;
  constructor() {
      // 层级id列表
      this.levelIdList = [];
      this.createIds = [];
      this.timer = null;
      // 监听判断创建数据是否发生变化
      this.length = 400;
  }
  /**
   * @description: 判断采集的信息点位置， 如果差别太大， 判断脏数据
   * @param {any} pos 设备位置
   * @return {*}
   */
  judgePos(pos:Array<number>) {
      if (pos && Math.abs(pos[1]) > 200) {
          return true;
      }
      return false;
  }

  /**
 * @description 开始准备创建设备
 * @param {Object} complete 外界注入的回调
 * @param {Object} cb 外界注入的回调
 * @author yrj 2022-03-06
 */
  begin(complete: unknown, cb: () => void) {
      const { current } = window.uino.app.level;
      this.getLevelId(current);
      if (this.timer) {
          clearInterval(this.timer);
      }
      this.length = 400;
      if ((['Campus', 'Building'].includes(current.type))) {
          // 创建设备
          this.createDevice(complete);
          if (current.type === 'Campus') {
              this.createIds.push(current.id);
          }
          if (cb) {
              const gone = false;
              this.timer = setInterval(() => {
                  if (this.length === 0 || gone) {
                      clearInterval(this.timer as NodeJS.Timeout);
                      cb();
                  }
              }, 1000);
          }
      } else if (cb) {
          cb();
      }
  }

  /**
   * @description: 创建设备
   * @param {any} complete
   */
  createDevice(complete: any) {
      const param = {
          sceneId: window.uino.sceneId,
          dataSources: 'TWIN'
      };
      const that = this;
      // 获取设备信息点接口
      getAllPointInfo(param).then((res: any) => {
          if (res.code !== 200) {
              message.error(res.message);
              return;
          }
          that.length = res.data.length;
          res.data.forEach((item : any) => {
              const obj = JSON.parse(item.cbData);
              // 判断位置异常的数据
              if (obj.parent == '0') {
                  obj.parent = 'Campus';
              }
              const {
                  twinClassName, uuid, twinClassCode
              } = item;
              const userData = {
                  dataSources: 'TWIN',
                  name: twinClassName,
                  uuid,
                  twinClassName,
                  twinClassCode,
                  pointId: item.UniqueCode || '',
                  deviceType: twinClassName,
                  deviceId: item.UniqueCode,
                  deviceName: item.name
              };
              if (obj.bundle) {
                  window.uino.app.create({
                      id: obj.id,
                      name: item.name,
                      type: 'Deploy',
                      url: `${`http://10.100.30.211/resource/model/${obj.bundle}`}/0/gltf/`,
                      angles: obj.rot,
                      scale: obj.scale,
                      properties: userData,
                      localPosition: obj.pos,
                      parent: window.uino.app.query(`#${obj.parent}`)[0],
                      // complete({ object } : any) {
                      //     // 创建Marker绑定点击事件
                      //     createBaseMarker(object, Img, `deviceMarker_${twinClassName}`, (ev) => {
                      //             ev.on('DBLClick', () => {
                      //                 window.uino.app.camera.flyTo(ev.parent);
                      //             });
                      //         }
                      //     );
                      //     if (complete) {
                      //         complete(this, item);
                      //     }
                      // },
                      error() {
                          // eslint-disable-next-line no-console
                          message.error('创建失败', item);
                          that.length -= 1;
                      }
                  });
              }
          });
      });
  }

  /**
   * @description 获取层级id,用于创建设备
   * @param {Object} current 当前层级对象
   * @author yrj 2022-03-06
   */
  getLevelId(current: any) {
      this.levelIdList = [];
      switch (current.type) {
          case 'Campus':
              this.levelIdList.push(current.id);
              break;
          case 'Building':
              current.floors.forEach((floor: any) => {
                  this.levelIdList.push(floor.id);
              });
              break;
          case 'Floor':
              this.levelIdList.push(current.id);
              break;
          default:
              this.levelIdList = [];
      }
  }
}

export default loadDevice;
