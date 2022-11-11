/*
 * @Description: 加载，卸载，切换皮肤
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-02-25 17:02:49
 * @LastEditors: yls
 * @LastEditTime: 2022-05-19 14:20:39
 */
import { loadScript } from '../utils';

export default class themeControl {
    private control:object;
    option:any
    ctrl:any
    background:any
    skyEffect:any
    postEffect:any
    lighting:any
    campus:any
    modelData: any
    modelDataUrl: any
    tempData: any
    tempUrl: any
    groundVisible: boolean
    particleVisible :boolean
    constructor(option:any) {
        this.control = new window.THING.EffectThemeControl();
        this.option = option;
        this.ctrl = null;
        this.background = null; // 背景
        this.skyEffect = null; // 天空盒
        this.postEffect = null; // 后期设置
        this.lighting = null; // 灯光效果
        this.modelDataUrl = null; // 模板路径
        this.modelData = null; // 模板数据
        this.tempData = null; // 临时模板路径，在关闭模板后，再次开启效果时调用
        this.tempUrl = null; // 临时模板路径，在关闭模板后，再次开启效果时调用
        this.groundVisible = true; // 特效地面是否显示
        this.particleVisible = true; // 特效粒子是否显示
        this.campus = null;
        option && this.init();
    }
    /**
     * @description: 加载场景效果
     * @param {string} frame frame.js的文件地址
     * @param {string} file frame文件夹的根目录
     */
    init() {
        this.lighting = this.deepClone(window.uino.app.lighting);
        this.postEffect = this.deepClone(window.uino.app.postEffect);
        this.skyEffect = this.deepClone(window.uino.app.skyBox);
        this.background = window.uino.app.background;
        this.loadTheme(this.option);
    }

    /**
     * @description: 切换效果模板
     * @param {any} option 效果模板对应的资源地址
     */
    changeTheme(option:any) {
        this.removeTheme();
        option && this.loadTheme(option);
    }

    initEffectThemeControl(modelData:any, modelDataUrl:any) {
        // 注册模板,modelData是模板数据。如果是本地效果模板包，必须填第三个参数modelDataUrl，该参数是模板包相对于该片代码的路径，default自定义名字
        this.ctrl.registerTheme('default', modelData, modelDataUrl);
        // 获取园区
        this.campus = window.uino.app.query('.Campus')[0];
        // 应用效果模板
        this.campus.applyTheme('default'); // class等
        this.ctrl.applyEffectTheme('default', this.campus); // 特效地面和粒子
        this.ctrl.applyThemeEnvironment('default', this.campus); // 环境和灯光
    }

    removeTheme () {
        // 销毁效果模板
        if (THING.ThemeManager.findStyle('default')) {
            this.ctrl.destroyEffectTheme('default', this.campus);
            this.campus.applyTheme(null);
            // 清除全局参数背景和天空盒
            window.uino.app.skyBox = null;
            window.uino.app.background = null;
            this.globalEffectConfig(
                this.lighting, this.postEffect, this.skyEffect, this.background
            );
        }
    }

    /**
     * @description: 开启和关闭效果
     * @param {boolean} boolean // 是否开启效果
     */
    showTheme (boolean:boolean) {
        if (boolean) {
            // 开启
            this.modelData = this.deepClone(this.tempData); // 模板数据
            this.modelDataUrl = this.tempUrl; // 模板路径
            this.initEffectThemeControl(this.modelData, this.modelDataUrl); // 引用模板
        } else {
            // 关闭
            this.removeTheme(); // 销毁模板
            // 关闭效果模板后全局参数设置为默认的
            this.globalEffectConfig(
                this.lighting, this.postEffect, this.skyEffect, this.background
            );
        }
    }
    /**
     * @description: 特效地面开关
     * @param {boolean} boolean // 是否开启效果
     */
    showGround (boolean:boolean) {
        window.uino.app.query('.GroundObject').visible = boolean;
    }

    /**
     * @description: 特效粒子开关
     * @param {boolean} boolean // 是否开启效果
     */
    showParticle (boolean:boolean) {
        window.uino.app.query('.ParticleSystem').visible = boolean;
    }

    /**
     * @description: 初始化效果模板
     * @param {any} option 效果模板对应的资源地址
     */
    private loadTheme(option:any) {
        const { frame, file } = option;
        loadScript(frame, () => {
            try {
                window.uino.app.addControl(this.control, 'themeControlDefaul');
                // 获取模板控制器
                this.ctrl = window.uino.app.getControl('themeControlDefaul');
                this.modelData = this.deepClone(window.data.data);
                this.tempData = this.deepClone(window.data.data);
                this.modelDataUrl = file;
                this.tempUrl = file;
                this.initEffectThemeControl( this.modelData, this.modelDataUrl);
            } catch (error) {
            // eslint-disable-next-line
              console.log(error);
            }
        });
    }

    private deepClone(params:any) {
        return JSON.parse(JSON.stringify(params));
    }

    /**
     * @description: 设置皮肤其他效果
     * @param {any} config // 灯光效果
     * @param {any} effectConfig  // 后期设置
     * @param {any} skyBox // 天空盒
     * @param {any} background // 背景
     */
    private globalEffectConfig(
        config:any, effectConfig:any, skyBox:any, background:any
    ) {
        window.uino.app.lighting = config; // 灯光效果
        window.uino.app.postEffect = effectConfig; // 后期设置
        window.uino.app.skyBox = skyBox; // 天空盒
        window.uino.app.background = background; // 背景
    }
}
