/**
 * @description 场景层级面包屑
 * @author hasaiki
 * @date 2022/03/03
 * @export
 * @class SceneAccordion
 */
import { useMainStore } from '@/baseTi/store';
import { getScene, saveSceneCamConfig } from '@/baseTi/api';
import { notification } from 'ant-design-vue';
import _ from 'lodash';
export default class SceneAccordion {
    sceneTree: object // 场景树结构
    mainStore: any // store
    levelMap: Map<string, any> // 场景层级数据
    levelNameMap: Map<string, string> // 场景层级名称映射数据
    constructor() {
        this.mainStore = useMainStore();
        this.sceneTree = {};
        this.levelMap = new Map();
        this.levelNameMap = new Map();
        this.init();
    }
    /**
     * @description 初始化
     * @author hasaiki
     * @date 2022/03/03
     * @memberof SceneAccordion
     */
    async init() {
        const tree: any = this.mainStore.sceneTree;
        const uuid: String = this.mainStore.mainScene.uuid;
        if (!_.isEmpty(tree)) {
            this.sceneTree = tree;
        } else if (uuid) {
            this.sceneTree = await this.getAsyncData(uuid);
        }
        this.disposeLevelData(this.sceneTree);
    }
    /**
     * @description 获取场景信息
     * @author hasaiki
     * @date 2022/03/03
     * @param {String} uuid 场景uuid
     * @return {*} 返回
     * @memberof SceneAccordion
     */
    getAsyncData(uuid: String) {
        return new Promise<any>((resolve, reject) => {
            getScene({ uuid: uuid, flag: false }).then((response: any) => {
                if (response.code === 200) {
                    resolve(response.data);
                } else {
                    reject(new Error());
                }
            });
        });
    }
    /**
     * @description 获取层级数据
     * @author hasaiki
     * @date 2022/03/03
     * @param {string} uuid
     * @return {*} 返回层级数据
     * @memberof SceneAccordion
     */
    getLevelData(uuid: string) {
        if (uuid) {
            return this.levelMap.get(uuid);
        }
    }
    /**
     * @description 处理层级数据
     * @author hasaiki
     * @date 2022/03/03
     * @param {*} data
     * @memberof SceneAccordion
     */
    private disposeLevelData(data: any) {
        if (_.isEmpty(data)) return;
        if (data.dataType === 'scene' && data.uuid) {
            this.levelMap.set(data.uuid, data);
        }
        if (!_.isEmpty(data.children)) {
            data.children.forEach((item: any) => {
                if (item.campusBuilderId) {
                    this.levelMap.set(item.campusBuilderId, item);
                    this.levelNameMap.set(item.campusBuilderId, item.name);
                }
                if (!_.isEmpty(item.children)) {
                    this.disposeLevelData(item);
                }
            });
        }
    }
    /**
     * @description 设置面包屑数据
     * @author hasaiki
     * @date 2022/03/03
     * @param {*} data
     * @memberof SceneAccordion
     */
    setAccordingData(data: any) {
        this.sceneTree = data;
        this.disposeLevelData(data);
    }
    /**
     * @description 获取层级默认视角
     * @author hasaiki
     * @date 2022/03/04
     * @param {string} uuid
     * @return {*} 返回层级视角
     * @memberof SceneAccordion
     */
    getLevelView(uuid: string) {
        if (!uuid) return null;
        const levelMsg = this.levelMap.get(uuid);
        if (levelMsg) {
            return levelMsg.configCamInfo ? levelMsg.defaultCamInfo : null;
        }
        return null;
    }
    /**
   * @description 保存视角
   * @author hasaiki
   * @date 2022/03/04
   * @param {string} uuid
   * @param {string} [type=0]
   * @memberof SceneAccordion
   */
    setLevelView(uuid: string, type: number = 0) {
        if (!window.uino.app) return;
        const mainSceneUuid = this.mainStore.mainScene.uuid;
        if (!mainSceneUuid) return;
        const levelMsg = this.levelMap.get(uuid);
        if (levelMsg) {
            const param = {
                configCamInfo: `{"eye":"${window.uino.app.camera.position}","target":"${window.uino.app.camera.target}","distance":"${window.uino.app.camera.distance}"}`,
                mainUuid: mainSceneUuid,
                childUuid: levelMsg.uuid,
                camType: type
            };
            saveSceneCamConfig(param).then((res: any) => {
                if (res.code === 200) {
                    notification.success({
                        message: '成功',
                        description: '视角保存成功'
                    });
                } else {
                    notification.error({
                        message: '失败',
                        description: '视角保存失败'
                    });
                }
            });
        }
    }
    /**
     * @description 进入层级
     * @author hasaiki
     * @date 2022/03/08
     * @param {string} uuid
     * @param {Function} cb
     * @memberof SceneAccordion
     */
    enterLevel(uuid: string, cb: Function) {
        const obj = window.uino.app.query(`##${uuid}`)[0];
        if (!obj) return;
        window.uino.app.level.change(obj, {
            complete: () => {
                if (_.isFunction(cb)) {
                    cb();
                }
            }
        });
    }
}
